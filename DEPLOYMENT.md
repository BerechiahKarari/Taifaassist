# 🚀 Railway Deployment Guide

## Step-by-Step Instructions

### 1. Create a GitHub Repository (if not already done)

```bash
git init
git add .
git commit -m "Prepare for Railway deployment"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 2. Deploy to Railway

1. Go to [railway.app](https://railway.app)
2. Click "Start a New Project"
3. Select "Deploy from GitHub repo"
4. Authorize Railway to access your GitHub
5. Select your `taifaassist` repository
6. Railway will automatically detect your project and start deploying

### 3. Configure Environment Variables (Optional)

In Railway dashboard:
- Click on your project
- Go to "Variables" tab
- Add any environment variables you need:
  - `NODE_ENV` is automatically set to `production`
  - `PORT` is automatically provided by Railway

### 4. Get Your Public URL

- Once deployed, Railway will provide a public URL like: `https://taifaassist-production.up.railway.app`
- Click on "Settings" → "Generate Domain" if not automatically created

### 5. Monitor Your Deployment

- Check the "Deployments" tab for build logs
- Check the "Metrics" tab for performance monitoring
- View logs in real-time from the "Logs" tab

## What Was Changed

✅ Updated `server/index.js` to serve static files in production
✅ Added production start script in `package.json`
✅ Created `railway.json` configuration file
✅ Backend now serves the React frontend in production

## Testing Locally Before Deploy

```bash
# Build the frontend
npm run build

# Start in production mode
npm start
```

Then visit `http://localhost:5000` to test the production build locally.

## Free Tier Limits

Railway free tier includes:
- $5 credit per month
- 500 hours of usage
- Perfect for small projects and demos

## Troubleshooting

**Build fails?**
- Check the build logs in Railway dashboard
- Ensure all dependencies are in `package.json`

**App not loading?**
- Check that `NODE_ENV=production` is set
- Verify the build created a `dist` folder
- Check Railway logs for errors

**Need help?**
- Railway docs: [docs.railway.app](https://docs.railway.app)
- Railway Discord: [discord.gg/railway](https://discord.gg/railway)
