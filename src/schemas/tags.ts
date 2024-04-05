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

export const tags = mysqlTable("tags", {
    id: varchar("id", { length: 25 }).primaryKey().$defaultFn(createId),
    name: varchar("name", { length: 255 }).notNull(),
    order: tinyint("order").notNull().default(0),
    intro: text("intro").notNull(),
    createTime: timestamp("create_time", { mode: "string" })
        .notNull()
        .default(sql`CURRENT_TIMESTAMP`),
    updateTime: timestamp("update_time", { mode: "string" })
        .notNull()
        .default(sql`CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP`),
});

export const tagsRelations = relations(tags, ({ many }) => ({
    posts: many(posts),
}));

export const insertTagSchema = createInsertSchema(tags);
