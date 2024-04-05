declare module "bun" {
    interface Env {
        DB_HOST: string;
        DB_USERNAME: string;
        DB_PASSWORD: string;
        DB_PORT: number;
        DB_DATABASE: string;
        JWT_SECRET: string;
        JWT_EXPIRES_IN: string;
    }
}
