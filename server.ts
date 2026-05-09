import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { Octokit } from "octokit";
import "dotenv/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  const DATA_PATH = path.join(process.cwd(), "src/data.ts");
  const PUBLIC_DATA_PATH = path.join(process.cwd(), "public", "data.json");

  // Route for frontend to fetch dynamic data
  app.get("/data.json", (req, res) => {
    if (fs.existsSync(PUBLIC_DATA_PATH)) {
      res.sendFile(PUBLIC_DATA_PATH);
    } else {
      // Fallback or empty if not found
      res.status(404).json({ error: "Dynamic data not yet generated. Save from admin panel first." });
    }
  });

  // Helper to get data from local state-like storage or file
  app.get("/api/public/data", (req, res) => {
    try {
      const content = fs.readFileSync(DATA_PATH, "utf8");
      // Basic extraction of JSON parts from the ts file for the frontend
      // Note: In a real production app, we'd use a database or a real JSON file.
      // For this portfolio, we'll serve the raw content and let the client parse if needed,
      // or we can just send the content as a string.
      res.json({ content });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // API Route to read data.ts content
  app.get("/api/admin/data", (req, res) => {
    try {
      const content = fs.readFileSync(DATA_PATH, "utf8");
      res.json({ content });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // API Route to save data.ts content
  app.post("/api/admin/save-data", async (req, res) => {
    const { content, jsonData } = req.body;
    if (!content) {
      return res.status(400).json({ error: "Content is required" });
    }
    try {
      // 1. Save locally first (Source code sync)
      fs.writeFileSync(DATA_PATH, content, "utf8");

      // 2. Save JSON snapshot for the public site to fetch dynamically
      if (jsonData) {
        const jsonPath = path.join(process.cwd(), "public", "data.json");
        // Ensure public dir exists
        if (!fs.existsSync(path.join(process.cwd(), "public"))) {
          fs.mkdirSync(path.join(process.cwd(), "public"));
        }
        fs.writeFileSync(jsonPath, JSON.stringify(jsonData, null, 2), "utf8");
      }

      // 2. Sync with GitHub if configured
      const token = process.env.GITHUB_TOKEN;
      const owner = process.env.GITHUB_OWNER;
      const repo = process.env.GITHUB_REPO;
      const branch = process.env.GITHUB_BRANCH || "main";

      let githubSync = false;
      let githubErrorMsg = null;

      if (token && owner && repo) {
        try {
          const octokit = new Octokit({ auth: token });
          const filePath = "src/data.ts";

          // Get file SHA to update
          let sha: string | undefined;
          try {
            const { data }: any = await octokit.rest.repos.getContent({
              owner,
              repo,
              path: filePath,
              ref: branch,
            });
            sha = data.sha;
          } catch (e) {
            console.log("GitHub file not found or first upload");
          }

          // Create or update content
          await octokit.rest.repos.createOrUpdateFileContents({
            owner,
            repo,
            path: filePath,
            message: `Admin Update: ${new Date().toISOString()}`,
            content: Buffer.from(content).toString("base64"),
            sha,
            branch,
          });
          githubSync = true;
          console.log(`Successfully pushed to GitHub: ${owner}/${repo}`);
        } catch (err) {
          console.error("GitHub sync failed:", err);
          githubErrorMsg = (err as Error).message;
        }
      }

      res.json({ success: true, githubSync, githubError: githubErrorMsg });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    
    // Explicitly handle SPA fallback even in dev if Vite misses it (unlikely but safe)
    app.get("*", async (req, res, next) => {
      if (req.url.startsWith('/api')) return next();
      try {
        const template = fs.readFileSync(path.resolve(process.cwd(), "index.html"), "utf-8");
        const transformedTemplate = await vite.transformIndexHtml(req.url, template);
        res.status(200).set({ "Content-Type": "text/html" }).end(transformedTemplate);
      } catch (e) {
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      console.log(`[Express] Serving SPA fallback for: ${req.url}`);
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
