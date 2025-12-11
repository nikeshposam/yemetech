import "dotenv/config";
import { drizzle } from 'drizzle-orm/libsql';

class DatabaseConfig {
    database: any = null;
    connect() {
        if (this.database == null) {
            this.database = drizzle(process.env.DATABASE_NAME || "");
        }
        return this.database;
    };
}

export default new DatabaseConfig();