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

  // API Route to read data.ts content
  app.get("/api/admin/data", (req, res) => {
    try {
      const dataPath = path.join(process.cwd(), "src/data.ts");
      const content = fs.readFileSync(dataPath, "utf8");
      res.json({ content });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // API Route to save data.ts content
  app.post("/api/admin/save-data", async (req, res) => {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ error: "Content is required" });
    }
    try {
      // 1. Save locally first
      const dataPath = path.join(process.cwd(), "src/data.ts");
      fs.writeFileSync(dataPath, content, "utf8");

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
