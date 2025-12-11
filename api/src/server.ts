import express from "express";
import cors from "cors";
import requestsRoute from "./routes/requestsRoutes";

const server = express();

server.use(express.json());
server.use(cors({ origin: "*" }));
server.use("/api/requests", requestsRoute);
server.get("/api/healthz", (req, res) => {
    return res.send("YES! I'M ALIVE");
});
server.get("/api/", (req, res) => {
    return res.send("OKAY!!");
});

export default server;