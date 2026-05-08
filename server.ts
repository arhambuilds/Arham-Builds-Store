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
  
  // Logging middleware
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });

  // Admin API Credentials (Matching adminUtils.ts)
  const ADMIN_CREDENTIALS = {
    username: process.env.VITE_ADMIN_USERNAME || 'arhamadib@admin.in',
    password: process.env.VITE_ADMIN_PASSWORD || 'admin@2728',
    secretCode: process.env.VITE_ADMIN_SECRET_CODE || '271211'
  };

  console.log('🛡️ Admin Credentials loaded:', {
    username: ADMIN_CREDENTIALS.username,
    hasPassword: !!ADMIN_CREDENTIALS.password,
    secretCode: ADMIN_CREDENTIALS.secretCode
  });

  // GitHub Configuration
  const githubToken = process.env.GITHUB_TOKEN;
  const githubOwner = process.env.GITHUB_OWNER;
  const githubRepo = process.env.GITHUB_REPO;
  const githubBranch = process.env.GITHUB_BRANCH || 'main';

  console.log('🐙 GitHub Config loaded:', {
    hasToken: !!githubToken,
    owner: githubOwner,
    repo: githubRepo,
    branch: githubBranch
  });

  // API Routes
  app.post("/api/admin/save-products", async (req, res) => {
    console.log('📥 Received save-products request');
    const { username, password, secretCode, products } = req.body;

    // Verify Credentials
    if (
      username !== ADMIN_CREDENTIALS.username || 
      password !== ADMIN_CREDENTIALS.password || 
      secretCode !== ADMIN_CREDENTIALS.secretCode
    ) {
      console.warn('❌ Unauthorized access attempt:', { 
        providedUsername: username, 
        expectedUsername: ADMIN_CREDENTIALS.username,
        providedPin: secretCode,
        expectedPin: ADMIN_CREDENTIALS.secretCode
      });
      return res.status(401).json({ success: false, message: "Unauthorized: Invalid credentials or PIN." });
    }

    if (!Array.isArray(products)) {
      console.error('❌ Products is not an array:', typeof products);
      return res.status(400).json({ success: false, message: "Invalid data format: products must be an array" });
    }

    const content = JSON.stringify(products, null, 2);

    try {
      // 1. Local Persistence (for development/AI Studio)
      try {
        const dataPath = path.join(process.cwd(), 'src', 'products.json');
        fs.writeFileSync(dataPath, content, 'utf8');
        console.log('✅ Local file updated: src/products.json');
      } catch (fsError: any) {
        console.warn('⚠️ Local filesystem write failed (likely read-only/prod):', fsError.message);
        // Continue to GitHub sync if local fails (e.g. on serverless)
      }

      // 2. GitHub Persistence (if configured)
      if (githubToken && githubOwner && githubRepo) {
        console.log(`🚀 Attempting GitHub Sync to ${githubOwner}/${githubRepo}...`);
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
            console.log('📄 Found existing file on GitHub, sha:', sha);
          } catch (e) {
            console.log('📄 File not found on github, will create new one');
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
        } catch (ghError: any) {
          console.error('❌ GitHub Sync Error:', ghError.message);
          return res.status(500).json({ success: false, message: `GitHub Sync Failed: ${ghError.message}` });
        }
      } else {
        console.log('ℹ️ GitHub Sync skipped (missing config)');
      }

      res.json({ success: true, message: "Changes saved successfully" });
    } catch (error: any) {
      console.error('❌ Unexpected error saving products:', error);
      res.status(500).json({ success: false, message: `Server Error: ${error.message}` });
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
