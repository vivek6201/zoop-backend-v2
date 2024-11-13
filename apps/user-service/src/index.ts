import express from "express";
import router from "./routes";
import cors from "cors";
import { configDotenv } from "dotenv";

configDotenv()
const PORT = process.env.PORT;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

//mounting all routes
app.use(router);

app.listen(PORT, () => console.log(`server is up at ${PORT}`));
