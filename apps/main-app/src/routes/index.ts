import { Router } from "express";
import authRoutes from "./auth.routes";
import { createProxyMiddleware, Options } from "http-proxy-middleware";
import authMiddleware from "../middlewares/auth";
import {
  DeliveryServiceUrl,
  FoodServiceUrl,
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

const pServiceConfig: Options = createProxyConfigs("User Service")(
  UserServiceUrl,
  {
    "^/pService": "",
  }
);

const fServiceConfig: Options = createProxyConfigs("Food Service")(
  FoodServiceUrl,
  {
    "^/fService": "",
  }
);

const dServiceConfig: Options = createProxyConfigs("Delivery Service")(
  DeliveryServiceUrl,
  {
    "^/dService": "",
  }
);

const vServiceConfig: Options = createProxyConfigs("Vendor Service")(
  VendorServiceUrl,
  {
    "^/vService": "",
  }
);

router.use("/auth", authRoutes);
router.use("/pService", authMiddleware, createProxyMiddleware(pServiceConfig));
router.use("/fService", authMiddleware, createProxyMiddleware(fServiceConfig));
router.use("/dService", authMiddleware, createProxyMiddleware(dServiceConfig));
router.use("/vService", authMiddleware, createProxyMiddleware(vServiceConfig));

export default router;
