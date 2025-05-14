import { pgTable, text, serial, integer, timestamp, boolean, uniqueIndex, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  company: text("company"),
  role: text("role"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  isAdmin: boolean("is_admin").default(false),
  apiKey: text("api_key").unique(),
});

// Dataset categories
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  icon: text("icon"),
});

// Datasets
export const datasets = pgTable("datasets", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  price: doublePrecision("price").notNull(),
  recordCount: integer("record_count"),
  dataFormat: text("data_format"),
  updateFrequency: text("update_frequency"),
  lastUpdated: timestamp("last_updated").defaultNow(),
  previewAvailable: boolean("preview_available").default(true),
  filePath: text("file_path"),
  categoryId: integer("category_id").references(() => categories.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Relations between datasets and categories
export const datasetRelations = relations(datasets, ({ one }) => ({
  category: one(categories, {
    fields: [datasets.categoryId],
    references: [categories.id],
  }),
}));

// Dataset purchases
export const purchases = pgTable("purchases", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  datasetId: integer("dataset_id").references(() => datasets.id).notNull(),
  purchaseDate: timestamp("purchase_date").defaultNow().notNull(),
  amount: doublePrecision("amount").notNull(),
  encryptionKey: text("encryption_key").notNull(),
  status: text("status").default("completed").notNull(),
});

// Relations for purchases
export const purchaseRelations = relations(purchases, ({ one }) => ({
  user: one(users, {
    fields: [purchases.userId],
    references: [users.id],
  }),
  dataset: one(datasets, {
    fields: [purchases.datasetId],
    references: [datasets.id],
  }),
}));

// Cart items
export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  datasetId: integer("dataset_id").references(() => datasets.id).notNull(),
  addedAt: timestamp("added_at").defaultNow().notNull(),
});

// Relations for cart items
export const cartItemRelations = relations(cartItems, ({ one }) => ({
  user: one(users, {
    fields: [cartItems.userId],
    references: [users.id],
  }),
  dataset: one(datasets, {
    fields: [cartItems.datasetId],
    references: [datasets.id],
  }),
}));

// Contact requests
export const contactRequests = pgTable("contact_requests", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  company: text("company"),
  message: text("message").notNull(),
  scheduleCall: boolean("schedule_call").default(false),
  preferredDate: timestamp("preferred_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  status: text("status").default("pending").notNull(),
});

// Schemas for inserts
export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  username: true,
  password: true,
  firstName: true,
  lastName: true,
  company: true,
  role: true,
});

export const insertCategorySchema = createInsertSchema(categories);
export const insertDatasetSchema = createInsertSchema(datasets);
export const insertPurchaseSchema = createInsertSchema(purchases);
export const insertCartItemSchema = createInsertSchema(cartItems);
export const insertContactRequestSchema = createInsertSchema(contactRequests);

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

export type InsertDataset = z.infer<typeof insertDatasetSchema>;
export type Dataset = typeof datasets.$inferSelect;

export type InsertPurchase = z.infer<typeof insertPurchaseSchema>;
export type Purchase = typeof purchases.$inferSelect;

export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
export type CartItem = typeof cartItems.$inferSelect;

export type InsertContactRequest = z.infer<typeof insertContactRequestSchema>;
export type ContactRequest = typeof contactRequests.$inferSelect;
