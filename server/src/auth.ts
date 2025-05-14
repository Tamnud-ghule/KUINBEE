import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express, Request } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { db } from "./db";
import { User, users } from "@your-scope/shared";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

declare global {
  namespace Express {
    // Extend the Express User interface with our User properties
    interface User {
      id: number;
      email: string;
      username: string;
      password: string;
      firstName?: string;
      lastName?: string;
      company?: string;
      role?: string;
      createdAt: Date;
      updatedAt: Date;
      isAdmin: boolean;
      apiKey?: string;
    }
  }
}

const scryptAsync = promisify(scrypt);

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

export async function comparePasswords(supplied: string, stored: string): Promise<boolean> {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function generateApiKey(): string {
  return `ds_${uuidv4().replace(/-/g, '')}`;
}

export function setupAuth(app: Express) {
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    },
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (email: string, password: string, done: any) => {
        try {
          const [user] = await db
            .select()
            .from(users)
            .where(eq(users.email, email));

          if (!user || !(await comparePasswords(password, user.password))) {
            return done(null, false);
          } else {
            return done(null, user);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => done(null, user.id));
  
passport.deserializeUser(async (id: number, done) => {
    try {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, id));
      done(null, user as Express.User);
    } catch (error) {
      done(error);
    }
  });

  // Register route
  app.post("/api/register", async (req, res, next) => {
    try {
      // Check if user already exists
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.email, req.body.email));

      if (existingUser.length > 0) {
        return res.status(400).json({ error: "Email already in use" });
      }

      // Hash password and create user
      const hashedPassword = await hashPassword(req.body.password);
      const apiKey = generateApiKey();

      const [newUser] = await db
        .insert(users)
        .values({
          ...req.body,
          password: hashedPassword,
          apiKey,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      // Login the user
      req.login(newUser, (err) => {
        if (err) return next(err);
        // Don't return sensitive fields
        const { password, apiKey, ...userInfo } = newUser;
        res.status(201).json(userInfo);
      });
    } catch (error) {
      next(error);
    }
  });

  // Login route
  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err: any, user: Express.User | false, info: any) => {
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
      req.login(user, (err) => {
        if (err) return next(err);
        // Don't return sensitive fields
        const { password, apiKey, ...userInfo } = user;
        return res.status(200).json(userInfo);
      });
    })(req, res, next);
  });

  // Logout route
  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.status(200).json({ message: "Logged out successfully" });
    });
  });

  // Get current user
  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    // Don't return sensitive fields
    const { password, apiKey, ...userInfo } = req.user;
    res.json(userInfo);
  });

  // Generate new API key
  app.post("/api/regenerate-api-key", async (req: Request, res, next) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    try {
      const newApiKey = generateApiKey();
      
      const [updatedUser] = await db
        .update(users)
        .set({ apiKey: newApiKey, updatedAt: new Date() })
        .where(eq(users.id, req.user.id))
        .returning();
      
      // Update the session with the new user data
      req.login(updatedUser, (err) => {
        if (err) return next(err);
        res.json({ apiKey: newApiKey });
      });
    } catch (error) {
      next(error);
    }
  });

  // Get API key
  app.get("/api/api-key", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    res.json({ apiKey: req.user.apiKey });
  });
  
  // Update user profile
  app.patch("/api/user", async (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    try {
      const { firstName, lastName, company, password } = req.body;
      const updateData: any = { updatedAt: new Date() };
      
      // Only update fields that are provided
      if (firstName !== undefined) updateData.firstName = firstName;
      if (lastName !== undefined) updateData.lastName = lastName;
      if (company !== undefined) updateData.company = company;
      
      // If password is provided, hash it
      if (password) {
        updateData.password = await hashPassword(password);
      }
      
      // Update user in database
      const [updatedUser] = await db
        .update(users)
        .set(updateData)
        .where(eq(users.id, req.user.id))
        .returning();
      
      // Update session
      req.login(updatedUser, (err) => {
        if (err) return next(err);
        // Don't return sensitive fields
        const { password, apiKey, ...userInfo } = updatedUser;
        res.status(200).json(userInfo);
      });
    } catch (error) {
      next(error);
    }
  });
}
