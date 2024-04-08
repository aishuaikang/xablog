import { MySql2Database, drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "../schemas";

class DatabaseUtil {
    public db: MySql2Database<typeof schema>;
    constructor() {
        const poolConnection = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            port: process.env.DB_PORT,
            database: process.env.DB_DATABASE,
            connectionLimit: 200,
            maxIdle: 20, // max idle connections, the default value is the same as `connectionLimit`
        });

        this.db = drizzle(poolConnection, {
            schema,
            mode: "default",
            logger: true,
        });
        poolConnection.on("connection", (connection) => {
            console.log("数据库连接成功...");
            connection.on("error", (error) => {
                console.error("MySQL connection failed: ", error);
                process.exit(1);
            });
        });
    }
}

const databaseUtil = new DatabaseUtil();

export default databaseUtil;
