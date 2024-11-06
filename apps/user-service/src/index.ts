import express from "express";
import router from "./routes";

const PORT = process.env.PORT;
const app = express();

app.use("/api/v1", router)

app.listen(PORT, () => console.log(`server is up at ${PORT}`))