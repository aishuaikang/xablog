import { defineConfig } from "drizzle-kit";
export default defineConfig({
    driver: "mysql2",
    schema: "./src/schemas",
    dbCredentials: {
        host: process.env.DB_HOST,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
        database: process.env.DB_DATABASE,
    },
    verbose: true,
    strict: true,
});
