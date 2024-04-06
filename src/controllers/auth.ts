import Elysia, { t } from "elysia";
import { JwtService } from "../services/jwt";
import { UserService } from "../services/user";
import { UserSchema } from "../schemas";
import { AuthModel } from "../models/auth";

const AuthController = new Elysia({
    name: "Controller.Auth",
    prefix: "/auth",
})
    .use(JwtService)
    .use(UserService)
    .use(AuthModel)
    .post(
        "/",
        async ({ body: { username, password }, jwt, userService }) => {
            const user = await userService.getUserByUsername(username);
            if (!user) throw new Error("用户名或密码错误");

            if (user.role === "normal") {
                const isMatch = await Bun.password.verify(
                    password,
                    user.password
                );
                if (!isMatch) throw new Error("用户名或密码错误");
            }

            if (user.role === "super" && user.password !== password) {
                throw new Error("用户名或密码错误");
            }

            return {
                token: await jwt.sign({ id: user.id }),
                user,
            };
        },
        {
            body: "authLoginDto",
        }
    );

export { AuthController };
