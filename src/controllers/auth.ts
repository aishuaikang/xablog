import Elysia, { t } from "elysia";
import { users } from "../schemas";
import { eq } from "drizzle-orm";
import { JwtService } from "../services/jwt";
import { DatabaseService } from "../services/database";

const AuthController = new Elysia({
    name: "Controller.Auth",
    prefix: "/auth",
})
    .use(DatabaseService)
    .use(JwtService)
    .post(
        "/",
        async ({ body: { username, password }, jwt, dbService: { db } }) => {
            const user = await db.query.users.findFirst({
                where: eq(users.username, username),
            });

            if (!user) throw new Error("用户名或密码错误");
            const isMatch = await Bun.password.verify(password, user.password);
            if (!isMatch) throw new Error("用户名或密码错误");

            const token = await jwt.sign({ id: user.id });

            return {
                token,
                user,
            };
        },
        {
            body: t.Object({
                username: t.String(),
                password: t.String(),
            }),
        }
    );

export { AuthController };
