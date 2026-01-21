import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  phoneNumber: text("phone_number").unique().notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`(strftime('%s', 'now'))`)
    .notNull(),
});

export const clothingItems = sqliteTable("clothing_items", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  name: text("name").notNull(),
  type: text("type").notNull(), // e.g., 'shirt', 'pants'
  style: text("style"), // e.g., 'casual', 'formal'
  brand: text("brand"),
  color: text("color"),
  material: text("material"),
  season: text("season", { mode: "json" }).$type<string[]>().notNull(), // Stored as JSON array
  imageUrl: text("image_url"),
  isFavorite: integer("is_favorite", { mode: "boolean" }).default(false),
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`(strftime('%s', 'now'))`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .default(sql`(strftime('%s', 'now'))`)
    .notNull(),
});

export const histories = sqliteTable("histories", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  date: text("date").notNull(), // YYYY-MM-DD
  purpose: text("purpose").notNull(),
  combo: text("combo", { mode: "json" }).$type<{ items: string[], reason: string }>().notNull(), // JSON object of items
  weather: text("weather", { mode: "json" }).$type<{ temp: number, condition: string, season: string }>(), // JSON object of weather data
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`(strftime('%s', 'now'))`)
    .notNull(),
});
