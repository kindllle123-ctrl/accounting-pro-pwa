# AccountingPro PKR - Progressive Web App

A complete, offline-capable accounting software with PKR currency support, built as a Progressive Web App (PWA).

## 🚀 Features

✅ **Full Accounting Suite**
- Chart of Accounts Management
- Sales & Purchase Invoices
- Journal Vouchers
- Cash Receipts & Payments
- General Ledger View
- Trial Balance Report
- Profit & Loss Statement

✅ **PWA Capabilities**
- Works offline with Service Worker caching
- Installable on mobile & desktop
- Fast app-like experience
- Data synced to LocalStorage
- 8 beautiful theme options

✅ **PKR Currency Support**
- All amounts in Pakistani Rupees
- Proper double-entry bookkeeping
- Debit & Credit validation

## 📦 Installation

### Prerequisites
- Node.js 14+ and npm

### Setup

```bash
# Clone the repository
git clone https://github.com/kindllle123-ctrl/accounting-pro-pwa.git
cd accounting-pro-pwa

# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

The app will open at `http://localhost:3000`

## 🔑 Default Credentials

Create your own account on first login:
1. Click "Create one" on the login page
2. Enter username, email, and password
3. Start using AccountingPro

## 📱 Installation on Mobile

### iOS
1. Open in Safari
2. Tap Share button
3. Select "Add to Home Screen"
4. Tap "Add"

### Android
1. Open in Chrome
2. Tap the menu (three dots)
3. Tap "Install app" or "Add to Home screen"
4. Tap "Install"

## 🎨 Theme Selection

Click the palette icon (🎨) in the top-right to switch between 8 themes:
- Indigo (default)
- Emerald
- Slate
- Rose
- Amber
- Cyan
- Violet
- Teal

## 📊 Core Modules

### 1. Dashboard
Real-time overview of:
- Total accounts
- Vouchers posted
- Income & Expenses
- Net Profit/Loss
- Recent transactions

### 2. Chart of Accounts
Create and manage accounts with:
- Unique account codes
- Account names
- Category assignment (9 categories)
- Edit/Delete functionality

### 3. Transaction Entry
- Sales Invoices
- Purchase Invoices
- Journal Vouchers
- Cash Receipts
- Cash Payments

Features:
- Auto-balancing validation
- Debit/Credit entry
- Transaction narration
- Automatic voucher numbering

### 4. Reports

**Ledger**
- Account-wise transactions
- Running balance calculation
- Transaction details (date, voucher, type)

**Trial Balance**
- All accounts with balances
- Debit/Credit totals
- Balance verification

**Profit & Loss**
- Income accounts summary
- Expense accounts summary
- Net profit/loss calculation

## 💾 Data Storage

All data is stored in browser's LocalStorage:
- No server required
- Works offline
- Data persists across sessions
- Max ~5-10MB per domain

## 🔒 Security Notes

- Passwords stored in browser (LocalStorage)
- Use strong passwords
- Not suitable for production financial data
- For real accounting, use enterprise solutions

## 📱 Responsive Design

✅ Desktop (1024px+)
✅ Tablet (768px - 1023px)
✅ Mobile (< 768px)
- Collapsible sidebar
- Touch-optimized buttons
- Responsive tables

## 🛠️ Tech Stack

- **React 18** - UI framework
- **Service Worker** - Offline support
- **LocalStorage** - Client-side data persistence
- **CSS3** - Styling with animations
- **Progressive Web App API** - Native-like experience

## 🚢 Deployment

### Netlify
```bash
npm run build
# Deploy the 'build' folder to Netlify
```

### Vercel
```bash
npm run build
# Deploy the 'build' folder to Vercel
```

### GitHub Pages
```bash
npm run build
# Deploy build folder using gh-pages
```

**Note:** Requires HTTPS for PWA features

## 📋 Account Categories

Default categories:
- Customer
- Vendor
- Investor
- Bank
- Cash
- Income
- Expense
- Equity
- Other

## 🐛 Troubleshooting

### App won't load
- Clear browser cache: Ctrl+Shift+Delete
- Check browser console: F12 → Console
- Ensure JavaScript enabled

### LocalStorage full
- Export data
- Clear other site caches
- Use private browsing (more storage)

### Service Worker not updating
- Hard refresh: Ctrl+Shift+R
- Uninstall and reinstall app
- Clear app cache in settings

## 📞 Support

For issues, create a GitHub issue: [Issues](https://github.com/kindllle123-ctrl/accounting-pro-pwa/issues)

## 📄 License

MIT License - See LICENSE file

## 🎯 Roadmap

- [ ] Cloud sync (Firebase)
- [ ] Multi-user support
- [ ] PDF export
- [ ] Bank reconciliation
- [ ] Inventory tracking
- [ ] Tax calculations
- [ ] Financial forecasting

## 👨‍💻 Contributing

Contributions welcome! Fork, make changes, and submit PR.

---

**Built with ❤️ for Pakistan's accounting needs**
