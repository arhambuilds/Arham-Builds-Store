import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { Octokit } from "@octokit/rest";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(express.json({ limit: '10mb' }));

  // Admin API Credentials (Matching adminUtils.ts)
  const ADMIN_CREDENTIALS = {
    username: process.env.VITE_ADMIN_USERNAME || 'arhamadib@admin.in',
    password: process.env.VITE_ADMIN_PASSWORD || 'admin@2728',
    secretCode: process.env.VITE_ADMIN_SECRET_CODE || '271211'
  };

  // GitHub Configuration
  const githubToken = process.env.GITHUB_TOKEN;
  const githubOwner = process.env.GITHUB_OWNER;
  const githubRepo = process.env.GITHUB_REPO;
  const githubBranch = process.env.GITHUB_BRANCH || 'main';

  // API Routes
  app.post("/api/admin/save-products", async (req, res) => {
    const { username, password, secretCode, products } = req.body;

    // Verify Credentials
    if (
      username !== ADMIN_CREDENTIALS.username || 
      password !== ADMIN_CREDENTIALS.password || 
      secretCode !== ADMIN_CREDENTIALS.secretCode
    ) {
      console.warn('❌ Unauthorized access attempt:', { username, providedPin: secretCode });
      return res.status(401).json({ success: false, message: "Unauthorized: Invalid credentials or PIN. Try logging out and back in." });
    }

    if (!Array.isArray(products)) {
      return res.status(400).json({ success: false, message: "Invalid data" });
    }

    const content = JSON.stringify(products, null, 2);

    try {
      // 1. Local Persistence (for development/AI Studio)
      const dataPath = path.join(process.cwd(), 'src', 'products.json');
      fs.writeFileSync(dataPath, content, 'utf8');
      console.log('✅ Local file updated: src/products.json');

      // 2. GitHub Persistence (if configured)
      if (githubToken && githubOwner && githubRepo) {
        console.log('🚀 Attempting GitHub Sync...');
        const octokit = new Octokit({ auth: githubToken });
        const filePath = 'src/products.json';

        try {
          // Get current file to get SHA (required for update)
          let sha;
          try {
            const { data } = await octokit.repos.getContent({
              owner: githubOwner,
              repo: githubRepo,
              path: filePath,
              ref: githubBranch
            });
            if (!Array.isArray(data)) sha = data.sha;
          } catch (e) {
            console.log('Creating new file on GitHub...');
          }

          await octokit.repos.createOrUpdateFileContents({
            owner: githubOwner,
            repo: githubRepo,
            path: filePath,
            message: 'chore: update products.json via admin panel',
            content: Buffer.from(content).toString('base64'),
            sha,
            branch: githubBranch
          });
          console.log('✅ GitHub Repo updated successfully');
        } catch (ghError) {
          console.error('❌ GitHub Sync Error:', ghError);
          // Don't fail the whole request if GitHub sync fails but local write worked
        }
      }

      res.json({ success: true, message: "Changes saved successfully" });
    } catch (error) {
      console.error('❌ Error saving products:', error);
      res.status(500).json({ success: false, message: "Error saving changes" });
    }
  });

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`🛠️ Mode: ${process.env.NODE_ENV || 'development'}`);
  });
}

startServer();
