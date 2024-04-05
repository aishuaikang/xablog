import { createId } from "@paralleldrive/cuid2";
import { relations, sql } from "drizzle-orm";
import {
    bigint,
    int,
    mysqlTable,
    timestamp,
    varchar,
} from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-typebox";
import { users } from "./users";

export const uploads = mysqlTable("uploads", {
    id: varchar("id", { length: 25 }).primaryKey().$defaultFn(createId),
    userId: varchar("user_id", { length: 25 })
        .references(() => users.id)
        .notNull(),
    size: bigint("size", { mode: "number", unsigned: true }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    sourceName: varchar("source_name", { length: 255 }).notNull(),
    mimeType: varchar("mime_type", { length: 255 }).notNull(),
    downNum: int("down_num"),
    createTime: timestamp("create_time", { mode: "string" })
        .notNull()
        .default(sql`CURRENT_TIMESTAMP`),
    updateTime: timestamp("update_time", { mode: "string" })
        .notNull()
        .default(sql`CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP`),
});

export const uploadsRelations = relations(uploads, ({ one }) => ({
    user: one(users),
}));

export const insertUploadSchema = createInsertSchema(uploads);
