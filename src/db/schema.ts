import { pgTable, serial, text, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// 1. Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  uid: text("uid").notNull().unique(), // Firebase Auth UID
  email: text("email").notNull(),
  name: text("name").notNull(),
  role: text("role").default("user").notNull(), // 'user' or 'admin'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 2. Diseases table
export const diseases = pgTable("diseases", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  overview: text("overview").notNull(),
  aliases: jsonb("aliases").$type<string[]>().default([]).notNull(),
  symptoms: jsonb("symptoms").$type<string[]>().default([]).notNull(),
  prevention: jsonb("prevention").$type<string[]>().default([]).notNull(),
  warning: text("warning").notNull(),
  isCustom: boolean("is_custom").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 3. Medicines table
export const medicines = pgTable("medicines", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  use: text("use").notNull(),
  safety: text("safety").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 4. Support Messages table
export const supportMessages = pgTable("support_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email"),
  text: text("text").notNull(),
  status: text("status").default("Waiting for admin review").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 5. Chat History table (logs both guest & authenticated user conversations)
export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  uid: text("uid"), // Firebase Auth UID if authenticated, null for guest
  sender: text("sender").notNull(), // 'user' | 'bot'
  text: text("text").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relationships
export const usersRelations = relations(users, ({ many }) => ({
  chatMessages: many(chatMessages),
}));
