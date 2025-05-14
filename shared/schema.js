"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertContactRequestSchema = exports.insertCartItemSchema = exports.insertPurchaseSchema = exports.insertDatasetSchema = exports.insertCategorySchema = exports.insertUserSchema = exports.contactRequests = exports.cartItemRelations = exports.cartItems = exports.purchaseRelations = exports.purchases = exports.datasetRelations = exports.datasets = exports.categories = exports.users = void 0;
var pg_core_1 = require("drizzle-orm/pg-core");
var drizzle_zod_1 = require("drizzle-zod");
var drizzle_orm_1 = require("drizzle-orm");
// Users table
exports.users = (0, pg_core_1.pgTable)("users", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    email: (0, pg_core_1.text)("email").notNull().unique(),
    username: (0, pg_core_1.text)("username").notNull().unique(),
    password: (0, pg_core_1.text)("password").notNull(),
    firstName: (0, pg_core_1.text)("first_name"),
    lastName: (0, pg_core_1.text)("last_name"),
    company: (0, pg_core_1.text)("company"),
    role: (0, pg_core_1.text)("role"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
    isAdmin: (0, pg_core_1.boolean)("is_admin").default(false),
    apiKey: (0, pg_core_1.text)("api_key").unique(),
});
// Dataset categories
exports.categories = (0, pg_core_1.pgTable)("categories", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    name: (0, pg_core_1.text)("name").notNull(),
    slug: (0, pg_core_1.text)("slug").notNull().unique(),
    description: (0, pg_core_1.text)("description"),
    icon: (0, pg_core_1.text)("icon"),
});
// Datasets
exports.datasets = (0, pg_core_1.pgTable)("datasets", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    title: (0, pg_core_1.text)("title").notNull(),
    slug: (0, pg_core_1.text)("slug").notNull().unique(),
    description: (0, pg_core_1.text)("description").notNull(),
    price: (0, pg_core_1.doublePrecision)("price").notNull(),
    recordCount: (0, pg_core_1.integer)("record_count"),
    dataFormat: (0, pg_core_1.text)("data_format"),
    updateFrequency: (0, pg_core_1.text)("update_frequency"),
    lastUpdated: (0, pg_core_1.timestamp)("last_updated").defaultNow(),
    previewAvailable: (0, pg_core_1.boolean)("preview_available").default(true),
    filePath: (0, pg_core_1.text)("file_path"),
    categoryId: (0, pg_core_1.integer)("category_id").references(function () { return exports.categories.id; }),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
});
// Relations between datasets and categories
exports.datasetRelations = (0, drizzle_orm_1.relations)(exports.datasets, function (_a) {
    var one = _a.one;
    return ({
        category: one(exports.categories, {
            fields: [exports.datasets.categoryId],
            references: [exports.categories.id],
        }),
    });
});
// Dataset purchases
exports.purchases = (0, pg_core_1.pgTable)("purchases", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    userId: (0, pg_core_1.integer)("user_id").references(function () { return exports.users.id; }).notNull(),
    datasetId: (0, pg_core_1.integer)("dataset_id").references(function () { return exports.datasets.id; }).notNull(),
    purchaseDate: (0, pg_core_1.timestamp)("purchase_date").defaultNow().notNull(),
    amount: (0, pg_core_1.doublePrecision)("amount").notNull(),
    encryptionKey: (0, pg_core_1.text)("encryption_key").notNull(),
    status: (0, pg_core_1.text)("status").default("completed").notNull(),
});
// Relations for purchases
exports.purchaseRelations = (0, drizzle_orm_1.relations)(exports.purchases, function (_a) {
    var one = _a.one;
    return ({
        user: one(exports.users, {
            fields: [exports.purchases.userId],
            references: [exports.users.id],
        }),
        dataset: one(exports.datasets, {
            fields: [exports.purchases.datasetId],
            references: [exports.datasets.id],
        }),
    });
});
// Cart items
exports.cartItems = (0, pg_core_1.pgTable)("cart_items", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    userId: (0, pg_core_1.integer)("user_id").references(function () { return exports.users.id; }).notNull(),
    datasetId: (0, pg_core_1.integer)("dataset_id").references(function () { return exports.datasets.id; }).notNull(),
    addedAt: (0, pg_core_1.timestamp)("added_at").defaultNow().notNull(),
});
// Relations for cart items
exports.cartItemRelations = (0, drizzle_orm_1.relations)(exports.cartItems, function (_a) {
    var one = _a.one;
    return ({
        user: one(exports.users, {
            fields: [exports.cartItems.userId],
            references: [exports.users.id],
        }),
        dataset: one(exports.datasets, {
            fields: [exports.cartItems.datasetId],
            references: [exports.datasets.id],
        }),
    });
});
// Contact requests
exports.contactRequests = (0, pg_core_1.pgTable)("contact_requests", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    name: (0, pg_core_1.text)("name").notNull(),
    email: (0, pg_core_1.text)("email").notNull(),
    company: (0, pg_core_1.text)("company"),
    message: (0, pg_core_1.text)("message").notNull(),
    scheduleCall: (0, pg_core_1.boolean)("schedule_call").default(false),
    preferredDate: (0, pg_core_1.timestamp)("preferred_date"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    status: (0, pg_core_1.text)("status").default("pending").notNull(),
});
// Schemas for inserts
exports.insertUserSchema = (0, drizzle_zod_1.createInsertSchema)(exports.users).pick({
    email: true,
    username: true,
    password: true,
    firstName: true,
    lastName: true,
    company: true,
    role: true,
});
exports.insertCategorySchema = (0, drizzle_zod_1.createInsertSchema)(exports.categories);
exports.insertDatasetSchema = (0, drizzle_zod_1.createInsertSchema)(exports.datasets);
exports.insertPurchaseSchema = (0, drizzle_zod_1.createInsertSchema)(exports.purchases);
exports.insertCartItemSchema = (0, drizzle_zod_1.createInsertSchema)(exports.cartItems);
exports.insertContactRequestSchema = (0, drizzle_zod_1.createInsertSchema)(exports.contactRequests);
