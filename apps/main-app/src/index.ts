import { configDotenv } from "dotenv";
import express from "express";
import cors from "cors";
import router from "./routes";
import { SocketService } from "./services/socketService";
import { createServer } from "http";

configDotenv();
const app = express();
const server = createServer(app);
const port = process.env.PORT;

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

const socketService = SocketService.getInstance(server);
socketService.startServer();
