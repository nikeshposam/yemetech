import express from "express";
import cors from "cors";
import requestsRoute from "./routes/requestsRoutes";

const server = express();

server.use(express.json());
server.use(cors({ origin: "*" }));
server.use("/api/requests", requestsRoute);

export default server;