import { createId } from "@paralleldrive/cuid2";
import { relations, sql } from "drizzle-orm";
import {
    mysqlEnum,
    mysqlTable,
    timestamp,
    varchar,
} from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-typebox";
import { posts } from "./posts";
import { comments } from "./comments";
import { uploads } from "./uploads";
import { Static } from "elysia";

export const users = mysqlTable("users", {
    id: varchar("id", { length: 25 }).primaryKey().$defaultFn(createId),
    username: varchar("username", { length: 50 }).notNull().unique(),
    password: varchar("password", { length: 60 }).notNull(),
    email: varchar("email", { length: 100 }).notNull().unique(),
    phone: varchar("phone", { length: 15 }).notNull().unique(),
    role: mysqlEnum("role", ["super", "normal"]).notNull().default("normal"),
    createTime: timestamp("create_time", { mode: "string" })
        .notNull()
        .default(sql`CURRENT_TIMESTAMP`),
    updateTime: timestamp("update_time", { mode: "string" })
        .notNull()
        .default(sql`CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP`),
});

export const usersRelations = relations(users, ({ many }) => ({
    posts: many(posts),
    comments: many(comments),
    uploads: many(uploads),
}));

export const UserSchema = createInsertSchema(users);
export type UserSchemaType = Static<typeof UserSchema>;
