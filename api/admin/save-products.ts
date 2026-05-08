import { Octokit } from "@octokit/rest";

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { username, password, secretCode, products } = req.body;

  // Verify Credentials
  const ADMIN_CREDENTIALS = {
    username: process.env.VITE_ADMIN_USERNAME || 'arhamadib@admin.in',
    password: process.env.VITE_ADMIN_PASSWORD || 'admin@2728',
    secretCode: process.env.VITE_ADMIN_SECRET_CODE || '271211'
  };

  if (
    username !== ADMIN_CREDENTIALS.username || 
    password !== ADMIN_CREDENTIALS.password || 
    secretCode !== ADMIN_CREDENTIALS.secretCode
  ) {
    return res.status(401).json({ success: false, message: "Unauthorized. Please logout and login again." });
  }

  const content = JSON.stringify(products, null, 2);
  const githubToken = process.env.GITHUB_TOKEN;
  const githubOwner = process.env.GITHUB_OWNER;
  const githubRepo = process.env.GITHUB_REPO;
  const githubBranch = process.env.GITHUB_BRANCH || 'main';

  try {
    // On Vercel, we rely primarily on GitHub sync as the filesystem is read-only
    if (githubToken && githubOwner && githubRepo) {
      const octokit = new Octokit({ auth: githubToken });
      const filePath = 'src/products.json';

      try {
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
          console.log('File not found, creating new one...');
        }

        await octokit.repos.createOrUpdateFileContents({
          owner: githubOwner,
          repo: githubRepo,
          path: filePath,
          message: 'chore: update products via admin panel',
          content: Buffer.from(content).toString('base64'),
          sha,
          branch: githubBranch
        });

        return res.json({ success: true, message: "GitHub updated successfully!" });
      } catch (ghError: any) {
        return res.status(500).json({ success: false, message: `GitHub Sync Error: ${ghError.message}` });
      }
    } else {
      return res.status(400).json({ success: false, message: "GitHub configuration missing in environment variables." });
    }
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}
