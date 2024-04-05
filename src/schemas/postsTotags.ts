import { mysqlTable, primaryKey, varchar } from "drizzle-orm/mysql-core";
import { users } from "./users";
import { posts } from "./posts";

export const postsTotags = mysqlTable(
    "posts_to_tags",
    {
        postId: varchar("post_id", { length: 25 })
            .references(() => posts.id)
            .notNull(),

        tag_id: varchar("tag_id", { length: 25 })
            .references(() => users.id)
            .notNull(),
    },
    (t) => ({
        pk: primaryKey({ columns: [t.postId, t.tag_id] }),
    })
);
