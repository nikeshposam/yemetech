import db from "./models/config";
import server from "./server";

const port: number = Number(process.env.PORT) || 6000;
class App {
    constructor() {
        this.init();
    }
    init = async () => {
        db.connect();
        server.listen(port, () => {
            console.log(`Server runnning on port: ${port}`);
        });
    }
}

export default new App();