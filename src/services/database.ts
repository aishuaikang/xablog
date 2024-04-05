import { MySql2Database, drizzle } from "drizzle-orm/mysql2";
import Elysia from "elysia";
import mysql from "mysql2/promise";
import * as schema from "../schemas";

class Service {
    public db: MySql2Database<typeof schema>;
    constructor() {
        const poolConnection = mysql.createPool({
            host: "192.168.200.1",
            user: "root",
            password: "aiziji500",
            port: 3306,
            database: "xablog",
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
