import Elysia, { t } from "elysia";
import { users } from "../schemas";
import { UserModel } from "../models/user";
import { eq } from "drizzle-orm";
import { DatabaseService } from "../services/database";

const UserController = new Elysia({ name: "Controller.user", prefix: "/user" })
    .use(DatabaseService)
    .use(UserModel)
    .get("/", ({ dbService: { db } }) => db.query.users.findMany())
    .post(
        "/",
        async ({ dbService: { db }, body }) => {
            return db
                .insert(users)
                .values({
                    ...body,
                    password: await Bun.password.hash(body.password, {
                        algorithm: "bcrypt",
                        cost: 14, // number between 4-31
                    }),
                })
                .execute();
        },
        {
            body: "createUserDto",
        }
    )
    .put(
        "/:id",
        async ({ dbService: { db }, body, params }) => {
            return db
                .update(users)
                .set({
                    ...body,
                    password: body.password
                        ? await Bun.password.hash(body.password, {
                              algorithm: "bcrypt",
                              cost: 14,
                          })
                        : undefined,
                })
                .where(eq(users.id, params.id))
                .execute();
        },
        {
            params: t.Object({ id: t.String() }),
            body: "updateUserDto",
        }
    );

export { UserController };
