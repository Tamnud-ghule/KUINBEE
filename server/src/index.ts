import 'dotenv/config';
import express, { type Request, type Response, type NextFunction } from "express";
import { join } from "path";
import passport from "passport";
import { db } from "./db";
import { seedDatabase } from "./seedData";
import { registerRoutes } from "./routes";

// Use native __dirname (CommonJS behavior)
// No need to redefine it with process.cwd()

const app = express();

// Parse PORT as number safely
const PORT = parseInt(process.env.PORT || "5000", 10);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());

// Register routes (mounts /api internally)
registerRoutes(app);

// Serve client in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(join(__dirname, "../client/dist")));
  app.get("*", (_req, res) => {
    res.sendFile(join(__dirname, "../client/dist", "index.html"));
  });
}

// Error handling
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
});

// Start server
const startServer = async () => {
  try {
    await seedDatabase();
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

export default app;