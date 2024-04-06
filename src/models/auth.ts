import { UserSchema } from "../schemas";
import Elysia, { Static, t } from "elysia";

const authLoginDto = t.Pick(UserSchema, ["username", "password"]);

export type AuthLoginDto = Static<typeof authLoginDto>;

export const AuthModel = new Elysia({ name: "Model.Auth" }).model({
    authLoginDto,
});
