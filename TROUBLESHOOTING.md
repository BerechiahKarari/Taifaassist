# TaifaAssist Troubleshooting Guide

## Issue: Can't Send Messages or See Updates

### Problem
The send button is disabled or new features (like the Kenyan flag) aren't showing up after deployment.

### Root Cause
The service worker was aggressively caching old versions of the app files (HTML, JavaScript, CSS).

### Solution Applied
1. **Updated Service Worker** (`public/sw.js`):
   - Changed cache version from `v1` to `v2` to force cache refresh
   - Implemented **network-first** strategy for app files (HTML, JS, CSS)
   - Kept **cache-first** for static assets (images, fonts)
   - Skip caching for API requests entirely

2. **Cache Strategy**:
   - **Network-first**: Always fetch fresh HTML/JS/CSS from server, fallback to cache if offline
   - **Cache-first**: Use cached images/fonts, fetch if not cached
   - **No cache**: API requests always go to server

### How to Clear Cache (For Users)

#### Method 1: Hard Refresh (Recommended)
- **Windows/Linux**: `Ctrl + Shift + R` or `Ctrl + F5`
- **Mac**: `Cmd + Shift + R`

#### Method 2: Clear Service Worker Cache
1. Open browser DevTools (`F12`)
2. Go to **Application** tab (Chrome) or **Storage** tab (Firefox)
3. Click **Service Workers** in left sidebar
4. Click **Unregister** next to TaifaAssist
5. Click **Clear storage** or **Clear site data**
6. Refresh the page (`F5`)

#### Method 3: Incognito/Private Mode
- Open the Railway URL in an incognito/private window
- This bypasses all caches

#### Method 4: Clear Browser Cache
- **Chrome**: Settings → Privacy → Clear browsing data → Cached images and files
- **Firefox**: Settings → Privacy → Clear Data → Cached Web Content
- **Edge**: Settings → Privacy → Clear browsing data → Cached images and files

### Verification Steps

After clearing cache, verify:

1. **Kenyan Flag**: Should show black-white-red-white-green stripes with Maasai shield and crossed spears in center
2. **Send Button**: Should be enabled when you type a message
3. **Messages**: Should send successfully when you click send or press Enter

### Railway Deployment

The app is deployed on Railway and updates automatically when you push to GitHub:

1. Push changes: `git push`
2. Railway detects changes and rebuilds (takes 2-3 minutes)
3. Check deployment logs in Railway dashboard
4. Once deployed, users need to hard refresh to see changes

### Testing Locally

To test before deploying:

```bash
# Build the app
npm run build

# Start the server
npm start

# Open browser to http://localhost:5000
```

### Common Issues

#### Issue: "Can't send message"
- **Cause**: Input field is empty or contains only whitespace
- **Fix**: Type a message with actual text

#### Issue: "Service worker registration failed"
- **Cause**: HTTPS required for service workers (except localhost)
- **Fix**: Railway provides HTTPS automatically, no action needed

#### Issue: "Old version still showing"
- **Cause**: Browser cache or service worker cache
- **Fix**: Follow cache clearing steps above

#### Issue: "API requests failing"
- **Cause**: Rate limiting or server error
- **Fix**: Check Railway logs, wait a minute and try again

### Rate Limits

- **Chat**: 30 messages per minute
- **Live Agent**: 10 requests per minute
- **File Upload**: 5 uploads per 5 minutes

If you hit rate limits, wait a minute and try again.

### Support

If issues persist after clearing cache:
1. Check Railway deployment logs
2. Check browser console for errors (`F12` → Console tab)
3. Verify Railway app is running (check Railway dashboard)
4. Test in different browser or incognito mode
