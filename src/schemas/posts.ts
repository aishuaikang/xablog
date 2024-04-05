import { createId } from "@paralleldrive/cuid2";
import { relations, sql } from "drizzle-orm";
import {
    longtext,
    mysqlEnum,
    mysqlTable,
    text,
    timestamp,
    tinyint,
    varchar,
} from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-typebox";
import { users } from "./users";
import { categorys } from "./categorys";

export const posts = mysqlTable("posts", {
    id: varchar("id", { length: 25 }).primaryKey().$defaultFn(createId),
    userId: varchar("user_id", { length: 25 })
        .references(() => users.id)
        .notNull(),
    categoryId: varchar("category_id", { length: 25 })
        .references(() => categorys.id)
        .notNull(),
    status: mysqlEnum("popularity", ["public", "private", "draft"])
        .notNull()
        .default("draft"),
    isTop: tinyint("is_top"), // 是否置顶
    title: varchar("title", { length: 255 }).notNull(),
    intro: text("intro").notNull(),
    content: longtext("content").notNull(),
    createTime: timestamp("create_time", { mode: "string" })
        .notNull()
        .default(sql`CURRENT_TIMESTAMP`),
    updateTime: timestamp("update_time", { mode: "string" })
        .notNull()
        .default(sql`CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP`),
});

export const postsRelations = relations(posts, ({ one }) => ({
    user: one(users),
    category: one(categorys),
}));

export const insertPostSchema = createInsertSchema(posts);
