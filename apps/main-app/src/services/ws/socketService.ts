import { Server as HttpServer, IncomingMessage } from "http";
import { WebSocket, WebSocketServer } from "ws";
import performActions from "./socketActions";
import jwt, { JwtPayload } from "jsonwebtoken";

interface SocketMessage {
  type: string;
  data: any;
}

export class SocketService {
  private static _instance: SocketService;
  private server?: HttpServer;
  private wss?: WebSocketServer;
  private userSockets: Map<string, WebSocket> = new Map();

  private constructor() {}

  public static getInstance(server: HttpServer) {
    if (!this._instance) {
      this._instance = new SocketService();
      this._instance.server = server;
    }
    return this._instance;
  }

  private async extractId(token: string) {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("Secret not found!");
    }
    const decodedToken = jwt.verify(token, secret) as JwtPayload;
    const userId: string = decodedToken.id;

    return userId;
  }

  public async startServer() {
    if (!this.server) {
      throw new Error("HTTP Server not initialized");
    }

    this.wss = new WebSocketServer({ server: this.server });

    this.wss.on("connection", async (ws: WebSocket, req: IncomingMessage) => {
      ws.on("error", (err) => console.error("error is: ", err));

      const token = req.headers["authorization"]?.split(" ")[1];
      if (!token) {
        ws.close(1008, "Token not provided");
        return;
      }
      let id: string | null = null;
      try {
        id = await this.extractId(token);
      } catch (error) {
        console.error(error);
      }

      id !== null ? this.userSockets.set(id, ws) : null;

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
        if (id !== null) {
          this.userSockets.delete(id);
        }
      });
    });
  }

  public sendMessage(userId: string, message: SocketMessage): boolean {
    try {
      const socket = this.userSockets.get(userId);

      if (!socket || socket.readyState !== WebSocket.OPEN) {
        this.userSockets.delete(userId);
        return false;
      }

      socket.send(JSON.stringify(message));
      return true;
    } catch (error) {
      console.error(`Failed to send message to user ${userId}:`, error);
      return false;
    }
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
