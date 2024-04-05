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
        });

        this.db = drizzle(poolConnection, {
            schema,
            mode: "planetscale",
        });
        poolConnection.on("connection", (connection) => {
            console.log("connection");
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
