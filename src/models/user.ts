import { UserSchema } from "../schemas";
import Elysia, { Static, t } from "elysia";

const createUserDto = t.Omit(UserSchema, ["id", "createTime", "updateTime"]);

const updateUserDto = t.Partial(
    t.Omit(UserSchema, ["id", "createTime", "updateTime"])
);

const queryUserDto = t.Composite([
    t.Partial(t.Omit(createUserDto, ["password"])),
    t.Object({
        page: t.String(),
        limit: t.String(),
    }),
]);

export type CreateUserDto = Static<typeof createUserDto>;
export type UpdateUserDto = Static<typeof updateUserDto>;
export type QueryUserDto = Static<typeof queryUserDto>;

export const UserModel = new Elysia({ name: "Model.User" }).model({
    createUserDto,
    updateUserDto,
    queryUserDto,
});
