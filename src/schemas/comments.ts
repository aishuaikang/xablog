import { createId } from "@paralleldrive/cuid2";
import { relations, sql } from "drizzle-orm";
import {
    mysqlEnum,
    mysqlTable,
    text,
    timestamp,
    varchar,
} from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-typebox";
import { users } from "./users";

export const comments = mysqlTable("comments", {
    id: varchar("id", { length: 25 }).primaryKey().$defaultFn(createId),
    parentId: varchar("parent_id", { length: 25 }),
    userId: varchar("user_id", { length: 25 })
        .references(() => users.id)
        .notNull(),
    status: mysqlEnum("popularity", ["public", "check"]) // 公开 审核
        .notNull()
        .default("public"),
    content: text("content").notNull(),
    createTime: timestamp("create_time", { mode: "string" })
        .notNull()
        .default(sql`CURRENT_TIMESTAMP`),
    updateTime: timestamp("update_time", { mode: "string" })
        .notNull()
        .default(sql`CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP`),
});

export const commentsRelations = relations(comments, ({ one }) => ({
    user: one(users),
}));

// export const postsRelations = relations(posts, ({ one }) => ({
//     user: one(users, {
//         fields: [posts.userId],
//         references: [users.id],
//     }),
//     category: one(categorys, {
//         fields: [posts.categoryId],
//         references: [categorys.id],
//     }),
// }));

export const insertCommentSchema = createInsertSchema(comments);
