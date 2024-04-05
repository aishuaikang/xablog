import { createInsertSchema } from "drizzle-typebox";
import { users } from "../schemas";
import Elysia, { t } from "elysia";

export const insertUserSchema = createInsertSchema(users);

export const UserModel = new Elysia({ name: "Model.User" }).model({
    createUserDto: t.Omit(insertUserSchema, ["id", "createTime", "updateTime"]),
    updateUserDto: t.Partial(
        t.Omit(insertUserSchema, ["id", "createTime", "updateTime"])
    ),
});
