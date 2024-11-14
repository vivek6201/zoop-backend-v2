import express from "express";
import { configDotenv } from "dotenv";
import router from "./routes";
import cors from "cors";

configDotenv();
const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

//mounting all routes
app.use(router);

app.listen(PORT, () => console.log(`server is up at port ${PORT}`));
