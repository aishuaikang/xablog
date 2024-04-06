import Elysia, { t } from "elysia";
import { UserModel } from "../models/user";
import { UserService } from "../services/user";

const UserController = new Elysia({ name: "Controller.User", prefix: "/user" })
    .use(UserService)
    .use(UserModel)
    .get(
        "/",
        ({ userService, query }) => {
            console.log(query);
            return userService.getUserList();
        },
        {
            query: "queryUserDto",
        }
    )
    .post(
        "/",
        async ({ userService, body }) =>
            await userService.addUser({
                ...body,
                password: await Bun.password.hash(body.password, {
                    algorithm: "bcrypt",
                    cost: 14, // number between 4-31
                }),
            }),
        {
            body: "createUserDto",
        }
    )
    .put(
        "/:id",
        async ({ userService, params, body }) =>
            userService.updateUser(params.id, {
                ...body,
                password: body.password
                    ? await Bun.password.hash(body.password, {
                          algorithm: "bcrypt",
                          cost: 14,
                      })
                    : undefined,
            }),
        {
            params: t.Object({ id: t.String() }),
            body: "updateUserDto",
        }
    )
    .delete(
        "/:id",
        ({ userService, params }) => userService.deleteUser(params.id),
        {
            params: t.Object({ id: t.String() }),
        }
    );

export { UserController };
