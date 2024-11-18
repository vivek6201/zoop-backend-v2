import { Server as HttpServer, IncomingMessage } from "http";
import { WebSocket, WebSocketServer } from "ws";
import performActions from "./socketActions";

export class SocketService {
  private static _instance: SocketService;
  private server?: HttpServer;
  private wss?: WebSocketServer;

  private constructor() {}

  public static getInstance(server: HttpServer) {
    if (!this._instance) {
      this._instance = new SocketService();
      this._instance.server = server;
    }
    return this._instance;
  }

  async startServer() {
    if (!this.server) {
      throw new Error("HTTP Server not initialized");
    }

    this.wss = new WebSocketServer({ server: this.server });

    this.wss.on("connection", async (ws: WebSocket, req: IncomingMessage) => {
      ws.on("error", (err) => console.error("error is: ", err));

      ws.on("message", function message(data, isBinary) {
        let message: {
          type: string;
          data: any;
        } | null = null;

        try {
          message = JSON.parse(data.toString());
        } catch (error) {
          console.error("Error parsing message:", error);
        }

        if (message) {
          performActions(message, ws);
        }
      });

      ws.on("close", () => {
        console.log("Client disconnected");
      });
    });
  }

  // Method to broadcast to all connected clients
  broadcast(data: any) {
    if (!this.wss) return;

    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  }
}
