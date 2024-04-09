import Elysia from "elysia";
import databaseUtil from "../utils/database";
import { CreateUserDto, QueryUserDto, UpdateUserDto } from "../models/user";
import { UserSchemaType, users } from "../schemas";
import { and, count, eq, like } from "drizzle-orm";

class Service {
    // 根据分页获取用户列表
    async getUserListByQuery(query: QueryUserDto) {
        const { page, limit, ...otherQuery } = query;

        const current = parseInt(page);
        const size = parseInt(limit);

        if (isNaN(current) || isNaN(size))
            throw new Error("page和limit必须是数字");

        // 查询出符合条件的用户列表
        const userList = await databaseUtil.db
            .select({
                id: users.id,
                username: users.username,
                email: users.email,
                phone: users.phone,
                role: users.role,
                createTime: users.createTime,
                updateTime: users.updateTime,
            })
            .from(users)
            .where(
                and(
                    ...Object.entries(otherQuery)
                        // .filter(([_key, value]) => value !== undefined)
                        .map(([key, value]) => {
                            return like(
                                users[key as keyof UserSchemaType],
                                `%${value}%`
                            );
                        })
                )
            )
            .as("userList");

        const totalResult = await databaseUtil.db
            .select({ count: count() })
            .from(userList)
            .execute();

        return {
            total: totalResult.reduce((acc, cur) => {
                acc += cur.count;
                return acc;
            }, 0),
            data: await databaseUtil.db
                .select()
                .from(userList)
                .offset((current - 1) * size)
                .limit(size)
                .execute(),
        };
    }

    // 获取全部用户列表
    async getUserList() {
        return await databaseUtil.db.query.users.findMany({
            columns: { password: false },
        });
    }

    // 根据id获取用户
    async getUserById(id: string) {
        return await databaseUtil.db.query.users.findFirst({
            where: eq(users.id, id),
            columns: { password: false },
        });
    }

    // 根据用户名获取用户
    async getUserByUsername(username: UserSchemaType["username"]) {
        return await databaseUtil.db.query.users.findFirst({
            where: eq(users.username, username),
        });
    }

    // 添加用户
    async addUser(data: CreateUserDto) {
        return await databaseUtil.db.insert(users).values(data).execute();
    }

    // 修改用户
    async updateUser(id: string, data: UpdateUserDto) {
        return await databaseUtil.db
            .update(users)
            .set(data)
            .where(eq(users.id, id))
            .execute();
    }

    // 删除用户
    async deleteUser(id: string) {
        return await databaseUtil.db
            .delete(users)
            .where(eq(users.id, id))
            .execute();
    }
}

const UserService = new Elysia({ name: "Service.User" }).decorate({
    userService: new Service(),
});

export { UserService };
