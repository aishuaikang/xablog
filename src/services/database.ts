import { MySql2Database, drizzle } from "drizzle-orm/mysql2";
import Elysia from "elysia";
import mysql from "mysql2/promise";
import * as schema from "../schemas";

class Service {
    public db: MySql2Database<typeof schema>;
    constructor() {
        const poolConnection = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            port: process.env.DB_PORT,
            database: process.env.DB_DATABASE,
            waitForConnections: true,
            connectionLimit: 200,
            maxIdle: 20, // max idle connections, the default value is the same as `connectionLimit`
            idleTimeout: 30000, // idle connections timeout, in milliseconds, the default value 60000
            queueLimit: 0,
            enableKeepAlive: true,
            keepAliveInitialDelay: 0,
        });

        this.db = drizzle(poolConnection, {
            schema,
            mode: "default",
        });
        poolConnection.on("connection", (connection) => {
            console.log("connection", connection.getMaxListeners());
            connection.on("error", (err) => {
                console.log("connection error", err);
            });
        });
    }
}

const DatabaseService = new Elysia({ name: "Service.Database" }).decorate({
    dbService: new Service(),
});

export { DatabaseService };
