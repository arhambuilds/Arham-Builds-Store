# Admin Panel Guide

This application includes a secure Admin Panel to manage your products.

## 🔐 Accessing the Admin Panel
1. Navigate to your website URL and add `/admin` at the end (e.g., `your-site.com/admin`).
2. Log in with your credentials:
   - **Username:** `arhamadib@admin.in`
   - **Password:** `admin@2728`
   - **Verification Code:** `271211`

## 🛠️ Features
- **Auto-Update Source Code:** Any change you make (Add/Edit/Delete) automatically updates the `src/products.json` file on the server.
- **Persistent Changes:** Changes are permanent and will be visible to all visitors after a page refresh.
- **Dynamic Slug:** Slugs are auto-generated from the title for SEO-friendly URLs.
- **Action Verification:** Critical actions require secure re-authentication to prevent unauthorized changes.

## 💾 Data Persistence
- **Automated:** No manual copying is needed. The app uses a full-stack Express backend to write changes directly to the source code.
- **Local Fallback:** Data is also mirrored in Local Storage for extreme performance and offline-capable browsing.

## 🚀 Deployment & GitHub Sync
To make changes permanent and auto-update your website's code on GitHub, follow these steps:

1. **Set Environment Variables:** In your hosting platform (Vercel, Cloud Run, etc.), add these variables:
   - `VITE_ADMIN_USERNAME`: Your admin email.
   - `VITE_ADMIN_PASSWORD`: Your admin password.
   - `VITE_ADMIN_SECRET_CODE`: Your 6-digit code.
   - `GITHUB_TOKEN`: A Personal Access Token from [GitHub Settings](https://github.com/settings/tokens).
   - `GITHUB_OWNER`: Your GitHub username.
   - `GITHUB_REPO`: The name of your repository.
   - `GITHUB_BRANCH`: (Optional) Default is `main`.

2. **Vercel Deployment:**
   - The app includes a `vercel.json` to handle SPA routing (preventing 404 on refresh).
   - Once connected, any change in the Admin Panel will automatically create a new commit in your GitHub repository!
   - This triggers a fresh build on Vercel, making your changes permanent for every visitor.

## ⚡ Performance & Security
- **Type Safety:** Uses a custom `useProducts` hook with full TypeScript support.
- **Secure Backend:** API endpoints are protected by triple-factor authentication.
- **GitHub Sync:** Keeps your source code in sync with your live edits.
- **Responsive:** Fully optimized for mobile, tablet, and desktop admin use.
