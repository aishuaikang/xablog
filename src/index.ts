import { Elysia } from "elysia";
import { UserController } from "./controllers/user";
import { AuthController } from "./controllers/auth";
import { bearer } from "@elysiajs/bearer";
import { logger } from "./plugins/logysia";

if (import.meta.main) {
    const app = new Elysia()
        .use(
            logger({
                logIP: true,
            })
        )
        .onError(({ code, error, set }) => {
            if (code === "VALIDATION") {
                return {
                    code: 9999,
                    error: error.validator.Errors(error.value).First(),
                    data: null,
                };
            }
            return { code: set.status, error: error.message, data: null };
        })
        .use(bearer())
        .use(AuthController)
        .guard(
            {
                async beforeHandle({ bearer, set, jwt }) {
                    if (!bearer) {
                        set.status = 400;
                        set.headers[
                            "WWW-Authenticate"
                        ] = `Bearer realm='sign', error="invalid_request"`;

                        throw new Error("需要携带令牌");
                    }
                    if (!(await jwt.verify(bearer))) {
                        set.status = 401;
                        throw new Error("令牌无效");
                    }
                },
            },
            (app) => app.use(UserController)
        )

        .listen(3000);

    console.log(
        `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
    );
}
