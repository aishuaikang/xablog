import Elysia from "elysia";
import database from "../utils/database";
import { CreateUserDto, QueryUserDto, UpdateUserDto } from "../models/user";
import { UserSchemaType, users } from "../schemas";
import { eq } from "drizzle-orm";

class Service {
    // 获取用户列表
    async getUserList() {
        return await database.db.query.users.findMany();
    }

    // 根据id获取用户
    async getUserById(id: string) {
        return await database.db.query.users.findFirst({
            where: eq(users.id, id),
        });
    }

    // 根据用户名获取用户
    async getUserByUsername(username: UserSchemaType["username"]) {
        return await database.db.query.users.findFirst({
            where: eq(users.username, username),
        });
    }

    // 添加用户
    async addUser(data: CreateUserDto) {
        return await database.db.insert(users).values(data).execute();
    }

    // 修改用户
    async updateUser(id: string, data: UpdateUserDto) {
        return await database.db
            .update(users)
            .set(data)
            .where(eq(users.id, id))
            .execute();
    }

    // 删除用户
    async deleteUser(id: string) {
        return await database.db
            .delete(users)
            .where(eq(users.id, id))
            .execute();
    }
}

const UserService = new Elysia({ name: "Service.User" }).decorate({
    userService: new Service(),
});

export { UserService };
