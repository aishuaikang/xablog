import jwt from "@elysiajs/jwt";
import Elysia from "elysia";

const JwtService = new Elysia({ name: "Service.Jwt" }).use(
    jwt({
        name: "jwt",
        secret: "Xiao Ai's Personal Blog",
        typ: "JWT",
        exp: "1m",
    })
);

export { JwtService };
