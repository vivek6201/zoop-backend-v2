import express from "express";
import cors from "cors";
import { configDotenv } from "dotenv";

configDotenv({path: "../../.env"});
const PORT = process.env.VENDOR_SERIVCE_PORT;
const app = express();

app.use(express.json());
app.use(cors());

app.listen(PORT, () => console.log(`server is up at ${PORT}`));
