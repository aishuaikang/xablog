import { createId } from "@paralleldrive/cuid2";
import { relations, sql } from "drizzle-orm";
import {
    mysqlTable,
    text,
    timestamp,
    tinyint,
    varchar,
} from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-typebox";
import { posts } from "./posts";
import { tags } from "./tags";

export const categorys = mysqlTable("categorys", {
    id: varchar("id", { length: 25 }).primaryKey().$defaultFn(createId),
    parentId: varchar("parent_id", { length: 25 }),
    name: varchar("name", { length: 255 }).notNull(),
    intro: text("intro").notNull(),
    order: tinyint("order").notNull().default(0),
    createTime: timestamp("create_time", { mode: "string" })
        .notNull()
        .default(sql`CURRENT_TIMESTAMP`),
    updateTime: timestamp("update_time", { mode: "string" })
        .notNull()
        .default(sql`CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP`),
});

export const categorysRelations = relations(categorys, ({ many }) => ({
    posts: many(posts),
    tags: many(tags),
}));

export const insertCategorySchema = createInsertSchema(categorys);
