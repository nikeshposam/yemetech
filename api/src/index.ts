import server from "./server";

const port: number = Number(process.env.PORT) || 6000;

server.listen(port, () => {
    console.log(`Server runnning on port: ${port}`);
});