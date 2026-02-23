# Sibyl ERP v1.0.0
### Built on Frappe Framework v16 + ERPNext v16

> Your complete whitelabel ERP. Sibyl ERP is a fully branded, 
> deeply customized deployment of Frappe + ERPNext — renamed, 
> redesigned, and extended into a product you own.

---

## Quick Setup

### 1. Prerequisites
- Ubuntu 22.04 / 24.04 server
- Frappe Bench installed (`pip install frappe-bench`)
- Frappe v16 + ERPNext v16 already set up in your bench

### 2. Install Sibyl ERP App

```bash
# Navigate to your bench directory
cd /path/to/your/bench

# Get the app (from your Git repo)
bench get-app sibyl_erp https://github.com/your-org/sibyl_erp.git

# Install on your site
bench --site your-site.local install-app sibyl_erp

# Build assets
bench build --app sibyl_erp

# Restart
bench restart
```

### 3. Verify Installation

Visit your site and you should see:
- ✅ Sibyl logo in the navbar
- ✅ Dark sidebar with Sibyl brand colors  
- ✅ Sibyl login page
- ✅ "Sibyl ERP" in browser tab
- ✅ Inter font throughout

---

## File Structure

```
sibyl_erp/
│
├── hooks.py                    ← Master control (assets, branding, hooks)
├── pyproject.toml              ← Package definition
│
├── sibyl_erp/                  ← Python module
│   ├── __init__.py
│   ├── setup/
│   │   └── install.py          ← After install / migrate hooks
│   ├── overrides/              ← DocType class overrides (Phase 2+)
│   ├── api/                    ← Custom API endpoints (Phase 2+)
│   └── utils/                  ← Shared utilities
│
├── public/
│   ├── css/
│   │   ├── sibyl-variables.css ← 🎨 ALL design tokens here
│   │   ├── sibyl-base.css      ← Typography, resets, buttons
│   │   ├── sibyl-navbar.css    ← Top navigation
│   │   ├── sibyl-sidebar.css   ← Left sidebar
│   │   ├── sibyl-desk.css      ← Workspace & shortcuts
│   │   ├── sibyl-forms.css     ← DocType forms
│   │   ├── sibyl-list.css      ← List views
│   │   ├── sibyl-modals.css    ← Dialogs & modals
│   │   └── sibyl-theme-dark.css← Dark mode
│   │
│   ├── js/
│   │   ├── sibyl-core.js       ← Core overrides + sibyl.* namespace
│   │   ├── sibyl-desk.js       ← Desk customizations
│   │   ├── sibyl-navbar.js     ← Navbar JS behavior
│   │   ├── sibyl-icons.js      ← Icon system
│   │   └── sibyl-notifications.js
│   │
│   └── img/
│       ├── sibyl-logo.svg      ← Main logo (dark bg)
│       ├── sibyl-logo-white.svg← White version for dark panels
│       ├── sibyl-favicon.png   ← Browser favicon
│       └── sibyl-icon-180.png  ← Apple touch icon
│
├── templates/
│   └── pages/
│       └── login.html          ← Custom login page
│
└── fixtures/                   ← Workspace & settings exports
```

---

## Customization Guide

### Changing Brand Colors
Edit `public/css/sibyl-variables.css`:
```css
:root {
    --sibyl-primary:   #5B6AF0;  /* ← Change this */
    --sibyl-accent:    #00C9A7;  /* ← And this    */
}
```
Then `bench build --app sibyl_erp` and hard-refresh.

### Changing Logo
Replace files in `public/img/`:
- `sibyl-logo.svg` — navbar logo (dark backgrounds)
- `sibyl-logo-white.svg` — login page logo
- `sibyl-favicon.png` — browser tab icon (32x32 or 64x64)
- `sibyl-icon-180.png` — mobile homescreen icon (180x180)

### Adding Custom DocType JS
In `hooks.py`:
```python
doctype_js = {
    "Sales Invoice": "public/js/overrides/sales_invoice.js",
}
```

### Adding Custom Sidebar Workspaces
1. Create/edit Workspace doctype in the desk
2. Export via `bench export-fixtures --app sibyl_erp`
3. Commit to your repo

---

## Development Workflow

```bash
# Watch for CSS/JS changes
bench watch

# After Python changes
bench restart

# After hooks.py changes
bench build --app sibyl_erp && bench restart

# Run tests
bench run-tests --app sibyl_erp

# Export fixtures
bench export-fixtures --app sibyl_erp
```

---

## Roadmap

### ✅ Phase 1 — Frontend Whitelabel (current)
- [x] Design token system (CSS variables)
- [x] Custom navbar
- [x] Custom sidebar
- [x] Custom desk/workspace
- [x] Custom forms
- [x] Custom login page
- [x] Dark mode
- [x] Core JS (sibyl namespace, toast, theme engine)
- [ ] Logo SVG files (add yours to `/public/img/`)
- [ ] Custom icons (Phase 1b)
- [ ] Custom notification panel

### 🔲 Phase 2 — Custom Desk Experience
- [ ] Role-based desk layouts
- [ ] Custom dashboard widgets
- [ ] Command palette (Cmd+K)
- [ ] Branded onboarding/setup wizard

### 🔲 Phase 3 — Backend Extensions
- [ ] Custom DocTypes for your domain
- [ ] Workflow overrides
- [ ] Custom reports
- [ ] REST API extensions

### 🔲 Phase 4 — Integrations
- [ ] Payment gateway
- [ ] SMS / email provider
- [ ] Webhooks & event bus
- [ ] Mobile PWA

---

## License
MIT — Sibyl Technologies
