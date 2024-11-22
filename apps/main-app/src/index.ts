import { configDotenv } from "dotenv";
import express from "express";
import cors from "cors";
import router from "./routes";
import { SocketService } from "./services/ws/socketService";
import { createServer } from "http";
import eventHandler from "./services/events";

configDotenv({path: "../../.env"});
const app = express();
const server = createServer(app);
const port = process.env.MAIN_APP_PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/api/v1", router);

app.get("/", (_, res) => {
  res.status(200).json({
    success: true,
    message: "Server is up at port " + port,
  });
});

server.listen(port, () => {
  console.log("server is up at: " + port);
});

//establish socket connection between server and client
export const socketService = SocketService.getInstance(server);
await socketService.startServer();

//initialize pubs/sub event handler, to perform event-driven backend communication.
eventHandler();
