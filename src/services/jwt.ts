import jwt from "@elysiajs/jwt";
import Elysia from "elysia";

const JwtService = new Elysia({ name: "Service.Jwt" }).use(
    jwt({
        name: "jwt",
        secret: process.env.JWT_SECRET,
        typ: "JWT",
        exp: process.env.JWT_EXPIRES_IN,
    })
);

export { JwtService };
