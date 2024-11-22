import express from "express";
import cors from "cors";
import { configDotenv } from "dotenv";
import router from "./routes";
import { eventHandler } from "./services";

configDotenv({path: "../../.env"});
const app = express();
const PORT = process.env.ORDER_SERVICE_PORT;

app.use(express.json());
app.use(cors());
app.use(router);

// handles all the pubsub events
eventHandler();

app.listen(PORT, () => console.log(`service is up at port ${PORT}`));
