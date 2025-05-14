import { users, type User, type InsertUser, cartItems, type CartItem, type InsertCartItem, datasets, type Dataset, purchases, type Purchase, contactRequests, type ContactRequest, type InsertContactRequest } from "@your-scope/shared";
import { db } from "./db";
import { eq, and, desc, asc } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { Pool } from "pg";
import { hashPassword, comparePasswords, generateApiKey } from "./auth";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // Session store
  sessionStore: session.Store;
  
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<User>): Promise<User>;
  
  // Cart methods
  getCartItems(userId: number): Promise<{item: CartItem, dataset: Dataset}[]>;
  addToCart(userId: number, datasetId: number): Promise<CartItem>;
  removeFromCart(userId: number, datasetId: number): Promise<void>;
  clearCart(userId: number): Promise<void>;
  
  // Purchase methods
  createPurchase(userId: number, datasetId: number, amount: number, encryptionKey: string): Promise<Purchase>;
  getUserPurchases(userId: number): Promise<{purchase: Purchase, dataset: Dataset}[]>;
  getPurchase(userId: number, datasetId: number): Promise<Purchase | undefined>;
  
  // Contact requests
  createContactRequest(request: InsertContactRequest): Promise<ContactRequest>;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;
  
  constructor() {
    // Create the session store with the database connection
    this.sessionStore = new PostgresSessionStore({
      pool: new Pool({ connectionString: process.env.DATABASE_URL }),
      createTableIfMissing: true,
    });
  }
  
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    // Hash the password before storing
    const hashedPassword = await hashPassword(insertUser.password);
    const apiKey = generateApiKey();
    
    const [user] = await db
      .insert(users)
      .values({
        ...insertUser,
        password: hashedPassword,
        apiKey,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
      
    return user;
  }
  
  async updateUser(id: number, userData: Partial<User>): Promise<User> {
    // Hash password if it's being updated
    if (userData.password) {
      userData.password = await hashPassword(userData.password);
    }
    
    userData.updatedAt = new Date();
    
    const [updatedUser] = await db
      .update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();
      
    return updatedUser;
  }
  
  // Cart methods
  async getCartItems(userId: number): Promise<{item: CartItem, dataset: Dataset}[]> {
    const items = await db
      .select({
        item: cartItems,
        dataset: datasets,
      })
      .from(cartItems)
      .innerJoin(datasets, eq(cartItems.datasetId, datasets.id))
      .where(eq(cartItems.userId, userId));
      
    return items;
  }
  
  async addToCart(userId: number, datasetId: number): Promise<CartItem> {
    // Check if item is already in cart
    const [existing] = await db
      .select()
      .from(cartItems)
      .where(and(eq(cartItems.userId, userId), eq(cartItems.datasetId, datasetId)));
      
    if (existing) {
      return existing;
    }
    
    const [item] = await db
      .insert(cartItems)
      .values({
        userId,
        datasetId,
        addedAt: new Date(),
      })
      .returning();
      
    return item;
  }
  
  async removeFromCart(userId: number, datasetId: number): Promise<void> {
    await db
      .delete(cartItems)
      .where(and(eq(cartItems.userId, userId), eq(cartItems.datasetId, datasetId)));
  }
  
  async clearCart(userId: number): Promise<void> {
    await db
      .delete(cartItems)
      .where(eq(cartItems.userId, userId));
  }
  
  // Purchase methods
  async createPurchase(userId: number, datasetId: number, amount: number, encryptionKey: string): Promise<Purchase> {
    const [purchase] = await db
      .insert(purchases)
      .values({
        userId,
        datasetId,
        amount,
        encryptionKey,
        purchaseDate: new Date(),
        status: 'completed',
      })
      .returning();
      
    return purchase;
  }
  
  async getUserPurchases(userId: number): Promise<{purchase: Purchase, dataset: Dataset}[]> {
    const userPurchases = await db
      .select({
        purchase: purchases,
        dataset: datasets,
      })
      .from(purchases)
      .innerJoin(datasets, eq(purchases.datasetId, datasets.id))
      .where(eq(purchases.userId, userId))
      .orderBy(desc(purchases.purchaseDate));
      
    return userPurchases;
  }
  
  async getPurchase(userId: number, datasetId: number): Promise<Purchase | undefined> {
    const [purchase] = await db
      .select()
      .from(purchases)
      .where(and(eq(purchases.userId, userId), eq(purchases.datasetId, datasetId)));
      
    return purchase;
  }
  
  // Contact requests
  async createContactRequest(request: InsertContactRequest): Promise<ContactRequest> {
    const [contactRequest] = await db
      .insert(contactRequests)
      .values({
        ...request,
        createdAt: new Date(),
        status: 'pending',
      })
      .returning();
      
    return contactRequest;
  }
}

export const storage = new DatabaseStorage();
