import express from "express";
import cors from "cors";
import requestsRoute from "./routes/requestsRoutes.js";

const PORT = 6000;
const server = express();

server.use(express.json());
server.use(cors({ origin: "*" }));
server.use("/api/requests", requestsRoute)

server.listen(PORT, () => {
    console.log(`Server is runnnin at: ${PORT}`);
})