import { defineConfig } from "drizzle-kit";
export default defineConfig({
    driver: "mysql2",
    schema: "./src/schemas",
    dbCredentials: {
        user: "root",
        password: "aiziji500",
        database: "xablog",
        host: "192.168.200.1",
    },
    verbose: true,
    strict: true,
});
