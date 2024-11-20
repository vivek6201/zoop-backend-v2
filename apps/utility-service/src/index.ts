import { configDotenv } from "dotenv";
import express from "express";
import handleRedisActions from "./actions/redis-actions";

configDotenv();
const app = express();
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`server is up at port ${PORT}`);
});

// gets data from the redis and processes it.
handleRedisActions();
