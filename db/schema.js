import { pgTable, serial, text, varchar, integer, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 100 }).notNull(),
  password_hash: text("password_hash").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull()
});

export const files = pgTable("files", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").notNull(),
  filename: text("filename").notNull(),
  original_name: text("original_name").notNull(),
  mime: text("mime").notNull(),
  size: integer("size").notNull(),
  path: text("path").default(null),
  url: text("url"),   // Imageurl by imagekit
  created_at: timestamp("created_at").defaultNow().notNull()
});
