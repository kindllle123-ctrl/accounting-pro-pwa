# Quick Start Guide

## 1️⃣ Installation

```bash
# Clone repository
git clone https://github.com/kindllle123-ctrl/accounting-pro-pwa.git
cd accounting-pro-pwa

# Install dependencies
npm install

# Or use the quick setup script
bash setup.sh
```

## 2️⃣ Generate App Icons

**Choose one method:**

### Quick (5 min) - Online Tool
1. Go to https://favicon.io/favicon-generator/
2. Enter text: "A"
3. Background color: #6366F1
4. Download all sizes (72-512px)
5. Extract to `public/icons/`

### Detailed - See `ICON_GENERATION.md`

## 3️⃣ Start Development

```bash
# Start dev server on http://localhost:3000
npm start

# Auto-opens in browser
# Hot-reload enabled
```

## 4️⃣ Test the App

### Create Account
1. Click "Create one" on login page
2. Enter:
   - Username: `demo` (or any username)
   - Email: `demo@accounting.pro`
   - Password: `demo123`
3. Click "Create Account →"

### Create Chart of Accounts
1. Go to **Chart of Accounts** page
2. Create sample accounts:
   - **Cash** (Code: 1010, Category: Cash)
   - **Bank Account** (Code: 1020, Category: Bank)
   - **Sales Revenue** (Code: 4000, Category: Income)
   - **Operating Expense** (Code: 5000, Category: Expense)

### Post Your First Voucher
1. Go to **Sales Invoice**
2. Fill details:
   - Date: Today
   - Narration: "First sale"
   - Account: Select Sales Revenue (Debit: 0, Credit: 10000)
   - Account: Select Bank Account (Debit: 10000, Credit: 0)
3. Click "Post Voucher"

### View Reports
1. **Dashboard** - See totals and recent vouchers
2. **Ledger** - View account transactions
3. **Trial Balance** - Verify debit/credit balance
4. **Profit & Loss** - See income vs expenses

## 5️⃣ Test Offline Mode

```bash
# 1. Open DevTools (F12)
# 2. Application → Service Workers
# 3. Check "Offline" checkbox
# 4. Refresh page (Ctrl+R)
# 5. App should still work!
```

## 6️⃣ Build for Production

```bash
# Create optimized build
npm run build

# Output: ./build/ folder
# Ready for deployment
```

## 7️⃣ Deploy to Production

### Netlify (Recommended)
```bash
# 1. Connect GitHub repo to Netlify
# 2. Set build command: npm run build
# 3. Set publish directory: build
# 4. Deploy!
```

### Vercel
```bash
# 1. Connect GitHub repo to Vercel
# 2. Auto-detects React app
# 3. Auto-deploys on push
```

### Self-Hosted
```bash
# 1. npm run build
# 2. Copy 'build' folder to server
# 3. Configure HTTPS (required for PWA)
# 4. Configure .htaccess for SPA routing
```

## 📱 Install on Mobile

### iPhone/iPad
1. Open Safari
2. Visit your app URL
3. Tap Share button
4. Tap "Add to Home Screen"
5. Tap "Add"

### Android/Chrome
1. Open Chrome
2. Visit your app URL
3. Tap menu (⋮)
4. Tap "Install app"
5. Tap "Install"

## 🎨 Switch Themes

Click palette icon (🎨) in top-right corner

**Available themes:**
- Indigo (default)
- Emerald
- Slate
- Rose
- Amber
- Cyan
- Violet
- Teal

## 💾 Data Management

### Export Data
1. Open DevTools (F12)
2. Console tab
3. Paste:
   ```javascript
   JSON.stringify(JSON.parse(localStorage.getItem('accpro_v4')), null, 2)
   ```
4. Copy the output
5. Save to file

### Import Data
1. Open DevTools (F12)
2. Console tab
3. Paste:
   ```javascript
   localStorage.setItem('accpro_v4', JSON.stringify(yourData))
   location.reload()
   ```

### Clear All Data
1. Go to any page
2. Sign out
3. This clears the session
4. To fully reset: DevTools → Application → LocalStorage → accpro_v4 → Delete

## 🔧 Troubleshooting

### App won't start
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm start
```

### Service Worker not working
```bash
# 1. DevTools (F12) → Application
# 2. Service Workers section
# 3. Unregister all
# 4. Hard refresh: Ctrl+Shift+R
# 5. Service Worker should re-register
```

### LocalStorage full
- Use private browsing (more storage)
- Export and clear old data
- Clear other site's LocalStorage

### Icons not showing
1. Verify files in `public/icons/`
2. Check DevTools → Network tab
3. Look for 404 errors
4. Regenerate icons

## 📊 Account Categories

Default categories (you can create any accounts):

| Category | Use Case |
|----------|----------|
| **Customer** | Accounts receivable |
| **Vendor** | Accounts payable |
| **Investor** | Equity investment |
| **Bank** | Bank accounts |
| **Cash** | Cash in hand |
| **Income** | Revenue accounts |
| **Expense** | Cost accounts |
| **Equity** | Capital/Retained earnings |
| **Other** | Miscellaneous |

## 🎓 Accounting Tips

### Double-Entry Bookkeeping
- Every transaction affects 2 accounts
- Debit one account, Credit another
- Total Debits = Total Credits

### Example: Receive Payment
- **Debit:** Bank Account (asset increased)
- **Credit:** Sales Revenue (income earned)
- Amount: 10,000 PKR

### Example: Pay Expense
- **Debit:** Expense Account (expense incurred)
- **Credit:** Bank Account (cash decreased)
- Amount: 5,000 PKR

## 🆘 Support

- **Issues?** GitHub: [Issues](https://github.com/kindllle123-ctrl/accounting-pro-pwa/issues)
- **Docs:** Check `README.md`
- **Icons:** See `ICON_GENERATION.md`

---

✨ **You're all set! Start accounting with AccountingPro!** ✨
