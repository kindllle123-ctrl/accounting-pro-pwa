# Deployment Guide

## 🚀 Deployment Options

### Option 1: Netlify (Recommended - Easiest)

#### Steps:
1. **Build locally first:**
   ```bash
   npm run build
   ```

2. **Connect to Netlify:**
   - Go to https://netlify.com
   - Sign in with GitHub
   - Click "New site from Git"
   - Select your repository
   - Set build settings:
     - Build command: `npm run build`
     - Publish directory: `build`
   - Click "Deploy site"

3. **Configure:**
   - Netlify auto-configures for React SPA
   - HTTPS enabled automatically ✅
   - PWA features work out of box ✅

#### Benefits:
- ✅ Free tier available
- ✅ Automatic HTTPS
- ✅ Auto-deploys on push
- ✅ Great performance
- ✅ Easy custom domain

---

### Option 2: Vercel

#### Steps:
1. **Build locally:**
   ```bash
   npm run build
   ```

2. **Deploy to Vercel:**
   - Go to https://vercel.com
   - Sign in with GitHub
   - Click "New Project"
   - Select your repository
   - Click "Deploy"

3. **Auto-configured:**
   - Build command: auto-detected
   - Output directory: auto-detected
   - HTTPS: automatic

#### Benefits:
- ✅ Fastest CDN
- ✅ Automatic HTTPS
- ✅ Free tier
- ✅ Zero-config
- ✅ Great for Next.js (optional upgrade)

---

### Option 3: GitHub Pages

#### Setup:
1. **Update package.json homepage:**
   ```json
   "homepage": "https://yourusername.github.io/accounting-pro-pwa"
   ```

2. **Install gh-pages:**
   ```bash
   npm install --save-dev gh-pages
   ```

3. **Update package.json scripts:**
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d build"
   }
   ```

4. **Deploy:**
   ```bash
   npm run deploy
   ```

5. **Enable GitHub Pages:**
   - Go to repo Settings → Pages
   - Source: Deploy from branch
   - Branch: gh-pages
   - Folder: / (root)
   - Click Save

#### Limitations:
- ⚠️ No custom domain (unless you configure)
- ⚠️ HTTPS on github.io only
- ⚠️ Manual deploy command
- ✅ Free hosting

---

### Option 4: Self-Hosted Server

#### Prerequisites:
- Web server (Apache, Nginx)
- HTTPS certificate (Let's Encrypt free)
- Node.js (optional, for backend)

#### Deployment Steps:

1. **Build locally:**
   ```bash
   npm run build
   ```

2. **Upload to server:**
   ```bash
   # Using SCP
   scp -r build/* user@yourserver.com:/var/www/accounting-pro/
   ```

3. **Configure Apache (.htaccess provided):**
   ```apache
   # Already included in public/.htaccess
   # Handles SPA routing
   ```
   
   Or **Configure Nginx:**
   ```nginx
   server {
       listen 443 ssl http2;
       server_name accounting.yourdomain.com;
       
       root /var/www/accounting-pro/build;
       index index.html;
       
       # SSL (Let's Encrypt)
       ssl_certificate /etc/letsencrypt/live/accounting.yourdomain.com/fullchain.pem;
       ssl_certificate_key /etc/letsencrypt/live/accounting.yourdomain.com/privkey.pem;
       
       # SPA routing
       location / {
           try_files $uri $uri/ /index.html;
       }
       
       # Cache static assets
       location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
           expires 1y;
           add_header Cache-Control "public, immutable";
       }
   }
   ```

4. **Enable HTTPS:**
   ```bash
   sudo certbot certonly -d accounting.yourdomain.com
   # Follow prompts to setup Let's Encrypt certificate
   ```

5. **Verify deployment:**
   ```bash
   curl -I https://accounting.yourdomain.com
   # Should return 200 OK
   ```

#### Benefits:
- ✅ Full control
- ✅ Custom domain
- ✅ Free HTTPS (Let's Encrypt)
- ⚠️ Requires server knowledge
- ⚠️ Manual maintenance

---

## ✅ Post-Deployment Checklist

### 1. Verify HTTPS
```bash
# Should show 🔒 in browser address bar
curl -I https://your-app-url.com
```

### 2. Test PWA Installation
- **Desktop:** Chrome DevTools → Application → Manifest
- **Mobile:** "Install app" prompt should appear

### 3. Check Lighthouse Score
```bash
# In Chrome DevTools → Lighthouse
# Run PWA audit
# Target: 90+ score
```

### 4. Test Offline Mode
1. Open DevTools (F12)
2. Application → Service Workers
3. Check "Offline"
4. Refresh page
5. App should work offline

### 5. Verify Service Worker
```bash
# In browser console:
navigator.serviceWorker.ready.then(reg => {
  console.log('SW active:', reg.active);
  console.log('SW scope:', reg.scope);
});
```

---

## 🔧 Performance Optimization

### Caching Strategy
The Service Worker implements **Network First** strategy:
1. Try to fetch from network
2. If offline, serve from cache
3. Update cache with fresh data

### Enable GZIP Compression
```nginx
# Nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript;
```

```apache
# Apache
mod_deflate.c enabled
```

### Set Cache Headers
```nginx
# Cache static assets for 1 year
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

---

## 📊 Monitoring

### Check Service Worker Status
```javascript
// In browser console
navigator.serviceWorker.getRegistrations().then(regs => {
  regs.forEach(reg => console.log(reg));
});
```

### Monitor Performance
- Netlify Analytics: Built-in
- Vercel Analytics: Built-in
- Google Analytics: Add manually

---

## 🆘 Deployment Troubleshooting

### "App not found" (404 Error)
- ✅ Check SPA routing configured
- ✅ Verify build folder uploaded
- ✅ Check .htaccess or nginx config

### "HTTPS required for PWA"
- ✅ Enable SSL certificate
- ✅ Redirect HTTP to HTTPS
- ✅ Update manifest.json URLs to HTTPS

### "Service Worker not registering"
- ✅ Verify HTTPS enabled
- ✅ Check service-worker.js path
- ✅ Hard refresh browser (Ctrl+Shift+R)

### "Icons not loading"
- ✅ Verify public/icons/ uploaded
- ✅ Check manifest.json icon paths
- ✅ Ensure HTTPS for icon URLs

---

## 🎯 Recommended Deployment

**For Best Experience:**
1. **Development:** Local (`npm start`)
2. **Staging:** Netlify preview
3. **Production:** Netlify or Vercel

**Setup Time:**
- Netlify: 5 minutes
- Vercel: 5 minutes
- GitHub Pages: 10 minutes
- Self-hosted: 30+ minutes

---

**Choose Netlify for fastest, easiest deployment!** 🚀
