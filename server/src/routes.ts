// /home/t_glinux/code/restructure/new project/server/src/routes.ts
import express, { Express, Request, Response, NextFunction } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { db } from "./db";
import { datasets, cartItems, purchases, categories } from "@your-scope/shared";
import { eq, count } from "drizzle-orm";
import CryptoJS from "crypto-js";
import { sendContactNotification } from './utils/email';
import path from 'path';
import fs from 'fs';
import { execFile } from 'child_process';
import { path7za } from "7zip-bin";

export async function registerRoutes(app: Express): Promise<void> {
  // Set up authentication routes and middleware
  setupAuth(app);

  // Get all categories
  app.get("/api/categories", async (req, res, next) => {
    try {
      const allCategories = await db.select().from(categories);
      res.json(allCategories);
    } catch (error) {
      next(error);
    }
  });

  // Get category by slug
  app.get("/api/categories/:slug", async (req, res, next) => {
    try {
      const slug = req.params.slug;
      const [category] = await db.select().from(categories).where(eq(categories.slug, slug));
      
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
      
      res.json(category);
    } catch (error) {
      next(error);
    }
  });

  // Contact request endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      const { name, email, company, message, preferredDate } = req.body;

      // Validate required fields
      if (!name || !email || !message) {
        return res.status(400).json({
          error: 'Missing required fields',
          details: {
            name: !name ? 'Name is required' : undefined,
            email: !email ? 'Email is required' : undefined,
            message: !message ? 'Message is required' : undefined,
          },
        });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          error: 'Invalid email format',
          details: {
            email: 'Please enter a valid email address',
          },
        });
      }

      // Process and validate date if provided
      let processedDate = null;
      if (preferredDate) {
        const date = new Date(preferredDate);
        if (isNaN(date.getTime())) {
          return res.status(400).json({
            error: 'Invalid date format',
            details: {
              preferredDate: 'Please enter a valid date',
            },
          });
        }
        if (date < new Date()) {
          return res.status(400).json({
            error: 'Invalid date',
            details: {
              preferredDate: 'Preferred date must be in the future',
            },
          });
        }
        processedDate = date;
      }

      // Create contact request
      const contactRequest = await storage.createContactRequest({
        name,
        email,
        company: company || null,
        message,
        preferredDate: processedDate,
      });

      // Try to send email notification, but don't fail if it doesn't work
      try {
        await sendContactNotification(contactRequest);
      } catch (emailError) {
        console.error('Failed to send email notification:', emailError);
        // Continue with the response even if email fails
      }

      res.status(201).json({
        success: true,
        message: 'Contact request submitted successfully',
        data: {
          id: contactRequest.id,
        },
      });
    } catch (error) {
      console.error('Error in contact endpoint:', {
        error: error instanceof Error ? error.message : error,
        stack: error instanceof Error ? error.stack : undefined,
        requestBody: req.body,
        env: {
          DATABASE_URL: process.env.DATABASE_URL ? 'set' : 'missing',
          SMTP_HOST: process.env.SMTP_HOST ? 'set' : 'missing',
          SMTP_USER: process.env.SMTP_USER ? 'set' : 'missing',
          SMTP_PASS: process.env.SMTP_PASS ? 'set' : 'missing',
          SMTP_FROM: process.env.SMTP_FROM ? 'set' : 'missing',
          CONTACT_NOTIFICATION_EMAIL: process.env.CONTACT_NOTIFICATION_EMAIL ? 'set' : 'missing',
        }
      });
      res.status(500).json({
        error: 'Failed to submit contact request',
        details: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    }
  });

  // Get all datasets with category information
  app.get("/api/datasets", async (req, res, next) => {
    try {
      const datasetsWithCategories = await db
        .select({
          id: datasets.id,
          title: datasets.title,
          slug: datasets.slug,
          description: datasets.description,
          price: datasets.price,
          recordCount: datasets.recordCount,
          dataFormat: datasets.dataFormat,
          updateFrequency: datasets.updateFrequency,
          lastUpdated: datasets.lastUpdated,
          previewAvailable: datasets.previewAvailable,
          categoryId: datasets.categoryId,
          category: {
            id: categories.id,
            name: categories.name,
            slug: categories.slug,
          },
        })
        .from(datasets)
        .leftJoin(categories, eq(datasets.categoryId, categories.id));
        
      res.json(datasetsWithCategories);
    } catch (error) {
      next(error);
    }
  });

  // Get dataset by ID with category information
  app.get("/api/datasets/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      
      const [dataset] = await db
        .select({
          id: datasets.id,
          title: datasets.title,
          slug: datasets.slug,
          description: datasets.description,
          price: datasets.price,
          recordCount: datasets.recordCount,
          dataFormat: datasets.dataFormat,
          updateFrequency: datasets.updateFrequency,
          lastUpdated: datasets.lastUpdated,
          previewAvailable: datasets.previewAvailable,
          categoryId: datasets.categoryId,
          category: {
            id: categories.id,
            name: categories.name,
            slug: categories.slug,
          },
        })
        .from(datasets)
        .leftJoin(categories, eq(datasets.categoryId, categories.id))
        .where(eq(datasets.id, id));
      
      if (!dataset) {
        return res.status(404).json({ error: "Dataset not found" });
      }
      
      res.json(dataset);
    } catch (error) {
      next(error);
    }
  });

  // Cart routes (requires authentication)
  app.get("/api/cart", async (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    try {
      const items = await storage.getCartItems(req.user.id);
      res.json(items);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/cart", async (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    try {
      const { datasetId } = req.body;
      
      if (!datasetId) {
        return res.status(400).json({ error: "Missing datasetId" });
      }
      
      // Check if dataset exists
      const [dataset] = await db.select().from(datasets).where(eq(datasets.id, datasetId));
      
      if (!dataset) {
        return res.status(404).json({ error: "Dataset not found" });
      }
      
      // Add to cart
      const cartItem = await storage.addToCart(req.user.id, datasetId);
      res.status(201).json(cartItem);
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/cart/:datasetId", async (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    try {
      const datasetId = parseInt(req.params.datasetId);
      await storage.removeFromCart(req.user.id, datasetId);
      res.status(200).json({ message: "Item removed from cart" });
    } catch (error) {
      next(error);
    }
  });

  // Process purchase
  app.post("/api/purchase", async (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    try {
      // In a real application, integrate with Stripe or another payment processor
      // For now, we'll simulate a successful purchase
      
      // Get cart items
      const cartItems = await storage.getCartItems(req.user.id);
      
      if (cartItems.length === 0) {
        return res.status(400).json({ error: "Cart is empty" });
      }
      
      // Process each item
      const purchases = [];
      
      for (const { item, dataset } of cartItems) {
        // Generate encryption key for the dataset
        const encryptionKey = CryptoJS.lib.WordArray.random(32).toString();
        
        // Create purchase record
        const purchase = await storage.createPurchase(
          req.user.id,
          dataset.id,
          dataset.price, // Use actual price from dataset
          encryptionKey
        );
        
        purchases.push({
          dataset,
          purchase,
          encryptionKey
        });
      }
      
      // Clear the cart
      await storage.clearCart(req.user.id);
      
      res.status(201).json({
        success: true,
        message: "Purchase completed successfully",
        purchases: purchases.map(p => ({
          datasetId: p.dataset.id,
          title: p.dataset.title,
          price: p.dataset.price,
          encryptionKey: p.encryptionKey
        }))
      });
    } catch (error) {
      next(error);
    }
  });

  // Get user purchases
  app.get("/api/purchases", async (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    try {
      const purchases = await storage.getUserPurchases(req.user.id);
      
      // Don't send the encryption key in the list view
      const safeData = purchases.map(({ purchase, dataset }) => ({
        id: purchase.id,
        datasetId: dataset.id,
        title: dataset.title,
        purchaseDate: purchase.purchaseDate,
        price: purchase.amount
      }));
      
      res.json(safeData);
    } catch (error) {
      next(error);
    }
  });

  // Get purchase details with encryption key
  app.get("/api/purchases/:datasetId", async (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    try {
      const datasetId = parseInt(req.params.datasetId);
      
      // Get the purchase
      const purchase = await storage.getPurchase(req.user.id, datasetId);
      
      if (!purchase) {
        return res.status(404).json({ error: "Purchase not found" });
      }
      
      // Get the dataset details
      const [dataset] = await db.select().from(datasets).where(eq(datasets.id, datasetId));
      
      if (!dataset) {
        return res.status(404).json({ error: "Dataset not found" });
      }
      
      res.json({
        purchase,
        dataset
      });
    } catch (error) {
      next(error);
    }
  });

  // Download encrypted dataset (as password-protected ZIP)
  app.get("/api/download/:datasetId", async (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    try {
      const datasetId = parseInt(req.params.datasetId);
      const purchase = await storage.getPurchase(req.user.id, datasetId);
      
      if (!purchase) {
        return res.status(403).json({ error: "You have not purchased this dataset" });
      }
      
      // Get dataset with category information
      const [dataset] = await db
        .select({
          id: datasets.id,
          title: datasets.title,
          slug: datasets.slug,
          filePath: datasets.filePath,
          category: {
            id: categories.id,
            name: categories.name,
            slug: categories.slug
          }
        })
        .from(datasets)
        .leftJoin(categories, eq(datasets.categoryId, categories.id));
      
      if (!dataset || !dataset.filePath) {
        return res.status(404).json({ error: "Dataset file not found" });
      }
      
      // Proper path construction using category slug
      const datasetsBasePath = path.join(__dirname, "../datasets"); // ✅ Correct: points to /server/datasets
      const fileName = dataset.filePath.split('/').pop() || 'dataset.csv'; // We only store filenames in DB
      const filePath = path.join(datasetsBasePath, dataset.category.slug, fileName); // Constructed as /server/datasets/energy/consumption-patterns.csv
      
      console.log('Attempting to download dataset from:', filePath); // For debugging
      
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ 
          error: "Dataset file does not exist on server", 
          hint: `Please verify file path is: /server/datasets/${dataset.category.slug}/${fileName}`,
          availableCategories: fs.readdirSync(datasetsBasePath).filter(f => fs.statSync(path.join(datasetsBasePath, f)).isDirectory()),
          availableFiles: fs.readdirSync(path.join(datasetsBasePath, dataset.category.slug)).filter(f => fs.statSync(path.join(datasetsBasePath, dataset.category.slug, f)).isFile())
        });
      }
      
      // Setup ZIP file creation
      const zipFileName = `${dataset.slug}-${Date.now()}.zip`;
      const tmpPath = path.join(__dirname, "..", "..", "tmp");
      const zipFilePath = path.join(tmpPath, zipFileName);
      
      // Create tmp directory if it doesn't exist
      if (!fs.existsSync(tmpPath)) {
        fs.mkdirSync(tmpPath, { recursive: true });
      }
      
      try {
        await new Promise<void>((resolve, reject) => {
          execFile(
            path7za,
            [
              'a',
              '-tzip',                // ZIP format
              `-p${purchase.encryptionKey}`,  // Encryption key
              '-mem=AES256',          // Encryption method
              zipFilePath,            // Output path
              filePath                // CSV file to compress
            ],
            (err, stdout, stderr) => {
              if (err) {
                console.error('7-Zip error:', {
                  error: err,
                  stderr,
                  stdout,
                });
                return reject(`7-Zip failed: ${stderr || stdout}`);
              }
              resolve();
            }
          );
        });
      } catch (zipError) {
        console.error('Failed to create ZIP:', zipError);
        return res.status(500).json({
          error: 'ZIP creation failed',
          details: zipError.toString()
        });
      }
      
      // Confirm ZIP file was created
      if (!fs.existsSync(zipFilePath)) {
        return res.status(500).json({
          error: 'ZIP file was not created'
        });
      }
      
      // Setup response to send ZIP
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', `attachment; filename="${zipFileName}"`);
      const readStream = fs.createReadStream(zipFilePath);
      
      // Cleanup function after download completes
      const cleanup = () => {
        fs.unlink(zipFilePath, (err) => {
          if (err) console.error('Failed to delete temp ZIP file:', err);
        });
      };
      
      readStream.on('error', (err) => {
        console.error('Read stream error:', err);
        cleanup();
        res.end();
      });
      
      res.on('close', cleanup);
      res.on('finish', cleanup);
      readStream.pipe(res);
    } catch (error) {
      console.error('Download route error:', error);
      next(error);
    }
  });

  // Admin routes (requires admin authentication)
  app.get("/api/admin/purchases", async (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated() || !req.user.isAdmin) {
      return res.status(403).json({ error: "Admin access required" });
    }
    
    try {
      // Get all purchases with joined dataset and user data
      const allPurchases = await db
        .select({
          id: purchases.id,
          userId: purchases.userId,
          datasetId: purchases.datasetId,
          purchaseDate: purchases.purchaseDate,
          amount: purchases.amount,
          status: purchases.status,
        })
        .from(purchases);
      
      res.json(allPurchases);
    } catch (error) {
      next(error);
    }
  });

  // Admin: Get all datasets (including full details)
  app.get("/api/admin/datasets", async (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated() || !req.user.isAdmin) {
      return res.status(403).json({ error: "Admin access required" });
    }
    
    try {
      const allDatasets = await db.select().from(datasets);
      res.json(allDatasets);
    } catch (error) {
      next(error);
    }
  });

  // Admin: Create dataset
  app.post("/api/admin/datasets", async (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated() || !req.user.isAdmin) {
      return res.status(403).json({ error: "Admin access required" });
    }
    
    try {
      const datasetData = req.body;
      
      // Generate slug if not provided
      if (!datasetData.slug) {
        datasetData.slug = datasetData.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '');
      }
      
      const [newDataset] = await db.insert(datasets).values(datasetData).returning();
      res.status(201).json(newDataset);
    } catch (error) {
      next(error);
    }
  });

  // Admin: Update dataset
  app.put("/api/admin/datasets/:id", async (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated() || !req.user.isAdmin) {
      return res.status(403).json({ error: "Admin access required" });
    }
    
    try {
      const id = parseInt(req.params.id);
      const datasetData = req.body;
      
      // Update the dataset
      const [updatedDataset] = await db
        .update(datasets)
        .set(datasetData)
        .where(eq(datasets.id, id))
        .returning();
      
      if (!updatedDataset) {
        return res.status(404).json({ error: "Dataset not found" });
      }
      
      res.json(updatedDataset);
    } catch (error) {
      next(error);
    }
  });

  // Admin: Delete dataset
  app.delete("/api/admin/datasets/:id", async (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated() || !req.user.isAdmin) {
      return res.status(403).json({ error: "Admin access required" });
    }
    
    try {
      const id = parseInt(req.params.id);
      
      // Check if dataset exists
      const [dataset] = await db.select().from(datasets).where(eq(datasets.id, id));
      if (!dataset) {
        return res.status(404).json({ error: "Dataset not found" });
      }
      
      // Check if the dataset has any associated purchases
      const purchaseList = await db.select().from(purchases).where(eq(purchases.datasetId, id));
      
      if (purchaseList.length > 0) {
        return res.status(409).json({
          error: "Cannot delete dataset that has been purchased. This would break user purchase history.",
          purchaseCount: purchaseList.length
        });
      }
      
      // Delete the dataset
      await db.delete(datasets).where(eq(datasets.id, id));
      res.status(200).json({ message: "Dataset deleted successfully" });
    } catch (error) {
      next(error);
    }
  });

  // Admin: Get all categories
  app.get("/api/admin/categories", async (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated() || !req.user.isAdmin) {
      return res.status(403).json({ error: "Admin access required" });
    }
    
    try {
      const allCategories = await db.select().from(categories);
      res.json(allCategories);
    } catch (error) {
      next(error);
    }
  });

  // Admin: Create category
  app.post("/api/admin/categories", async (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated() || !req.user.isAdmin) {
      return res.status(403).json({ error: "Admin access required" });
    }
    
    try {
      const categoryData = req.body;
      
      // Generate slug if not provided
      if (!categoryData.slug) {
        categoryData.slug = categoryData.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '');
      }
      
      const [newCategory] = await db.insert(categories).values(categoryData).returning();
      res.status(201).json(newCategory);
    } catch (error) {
      next(error);
    }
  });

  // Admin: Update category
  app.put("/api/admin/categories/:id", async (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated() || !req.user.isAdmin) {
      return res.status(403).json({ error: "Admin access required" });
    }
    
    try {
      const id = parseInt(req.params.id);
      const categoryData = req.body;
      
      // Update slug if name changed and slug not provided
      if (categoryData.name && !categoryData.slug) {
        categoryData.slug = categoryData.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '');
      }
      
      // Update the category
      const [updatedCategory] = await db
        .update(categories)
        .set(categoryData)
        .where(eq(categories.id, id))
        .returning();
      
      if (!updatedCategory) {
        return res.status(404).json({ error: "Category not found" });
      }
      
      res.json(updatedCategory);
    } catch (error) {
      next(error);
    }
  });

  // Admin: Delete category
  app.delete("/api/admin/categories/:id", async (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated() || !req.user.isAdmin) {
      return res.status(403).json({ error: "Admin access required" });
    }
    
    try {
      const id = parseInt(req.params.id);
      
      // Check if category exists
      const [category] = await db.select().from(categories).where(eq(categories.id, id));
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
      
      // Check if there are datasets using this category
      const datasetCount = await db
        .select()
        .from(datasets)
        .where(eq(datasets.categoryId, id));
      
      if (datasetCount.length > 0) {
        return res.status(400).json({
          error: "Cannot delete category that has datasets. Reassign datasets first."
        });
      }
      
      // Delete the category
      await db.delete(categories).where(eq(categories.id, id));
      res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
      next(error);
    }
  });
}