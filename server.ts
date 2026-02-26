import express from "express";
import { createServer as createViteServer } from "vite";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE = path.join(__dirname, "data", "points.json");
const LAYOUT_FILE = path.join(__dirname, "data", "layout.json");

// Ensure data directory exists
if (!fs.existsSync(path.join(__dirname, "data"))) {
  fs.mkdirSync(path.join(__dirname, "data"));
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes - Points
  app.get("/api/points", (req, res) => {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const data = fs.readFileSync(DATA_FILE, "utf-8");
        res.json(JSON.parse(data));
      } else {
        res.json([]);
      }
    } catch (error) {
      console.error("Error reading points:", error);
      res.status(500).json({ error: "Failed to read points" });
    }
  });

  app.post("/api/points", (req, res) => {
    try {
      const points = req.body;
      fs.writeFileSync(DATA_FILE, JSON.stringify(points, null, 2));
      res.json({ success: true });
    } catch (error) {
      console.error("Error saving points:", error);
      res.status(500).json({ error: "Failed to save points" });
    }
  });

  // API Routes - Layout
  app.get("/api/layout", (req, res) => {
    try {
      if (fs.existsSync(LAYOUT_FILE)) {
        const data = fs.readFileSync(LAYOUT_FILE, "utf-8");
        res.json(JSON.parse(data));
      } else {
        res.json([]);
      }
    } catch (error) {
      console.error("Error reading layout:", error);
      res.status(500).json({ error: "Failed to read layout" });
    }
  });

  app.post("/api/layout", (req, res) => {
    try {
      const layout = req.body;
      fs.writeFileSync(LAYOUT_FILE, JSON.stringify(layout, null, 2));
      res.json({ success: true });
    } catch (error) {
      console.error("Error saving layout:", error);
      res.status(500).json({ error: "Failed to save layout" });
    }
  });

  app.patch("/api/points/:id", (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      let points = [];
      if (fs.existsSync(DATA_FILE)) {
        points = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
      }
      
      const index = points.findIndex((p: any) => p.id === id);
      if (index !== -1) {
        points[index] = { ...points[index], ...updates };
        fs.writeFileSync(DATA_FILE, JSON.stringify(points, null, 2));
        res.json(points[index]);
      } else {
        res.status(404).json({ error: "Point not found" });
      }
    } catch (error) {
      console.error("Error updating point:", error);
      res.status(500).json({ error: "Failed to update point" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
