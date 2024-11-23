type ServiceConfig = {
  name: string;
  url: string;
  prefix: string;
};

import { Router } from "express";
import authRoutes from "./auth.routes";
import { createProxyMiddleware, Options } from "http-proxy-middleware";
import authMiddleware from "../middlewares/auth";
import {
  DeliveryServiceUrl,
  FoodServiceUrl,
  OrderServiceUrl,
  UserServiceUrl,
  VendorServiceUrl,
} from "../constants/urls";

const router: Router = Router();

//fundtion to create config files
const createProxyConfigs =
  (serviceName: string) =>
  (target: string, path: Record<string, string>): Options => {
    return {
      target,
      changeOrigin: true,
      pathRewrite: path,
      logger: console,
      on: {
        proxyReq: (pReq, req, res) => {
          if (req.headers.token)
            pReq.setHeader("token", JSON.stringify(req.headers.token));
          req.on("error", (err) => {
            console.error(`Request error in ${serviceName}:`, err);
            pReq.destroy();
          });

          if(req.headers["content-type"]?.includes('multipart/form-data')){
            return;
          }

          if ((req as any).body) {
            const bodyData = JSON.stringify((req as any).body);
            // Write the body content to the proxy request
            pReq.setHeader("Content-Length", Buffer.byteLength(bodyData));
            pReq.write(bodyData);
          }
        },
        proxyRes: (pRes, req, res) => {
          pRes.on("error", (err) => {
            console.error(`Response error in ${serviceName}:`, err);
            res.writeHead(502, {
              "Content-Type": "application/json",
            });
            res.end(
              JSON.stringify({
                error: "Bad Gateway",
                message: "Service temporarily unavailable",
              })
            );
          });
        },
        error: (err, req, res: any) => {
          console.error(`Proxy error in ${serviceName}:`, err);

          if (!res.headersSent) {
            res.writeHead(502, {
              "Content-Type": "application/json",
            });
            res.end(
              JSON.stringify({
                error: "Bad Gateway",
                message: "Service temporarily unavailable",
              })
            );
          }
        },
      },
    };
  };

const services: ServiceConfig[] = [
  {
    name: "User Service",
    url: UserServiceUrl,
    prefix: "^/pService",
  },
  {
    name: "Order Service",
    url: OrderServiceUrl,
    prefix: "^/oService",
  },
  {
    name: "Food Service",
    url: FoodServiceUrl,
    prefix: "^/fService",
  },
  {
    name: "Delivery Service",
    url: DeliveryServiceUrl,
    prefix: "^/dService",
  },
  {
    name: "Vendor Service",
    url: VendorServiceUrl,
    prefix: "^/vService",
  },
];

const setupProxyRoutes = (router: Router, services: ServiceConfig[]) => {
  // Add auth routes
  router.use("/auth", authRoutes);

  // Add service routes
  services.forEach((service) => {
    const config = createProxyConfigs(`${service.name}`)(service.url, {
      [service.prefix]: "",
    });
    router.use(service.prefix, authMiddleware, createProxyMiddleware(config));
  });

  return router;
};

export default setupProxyRoutes(router, services);
