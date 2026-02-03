# ChartFlow - Webflow Setup Guide

This guide walks you through setting up ChartFlow charts on your published Webflow site.

## Quick Start

ChartFlow requires two scripts to be added to your Webflow Page Settings. These scripts make your charts work on the published site.

### Step 1: Open Page Settings

1. In Webflow Designer, open the page where you inserted charts
2. Click on the **Pages** panel (left sidebar)
3. Hover over your page and click the **gear icon** (⚙️)
4. Select **Page Settings**
5. Navigate to the **Custom Code** tab
6. Scroll to **Before </body> tag** section

### Step 2: Add Chart.js Library (First Script)

Copy and paste this script into the "Before </body> tag" section:

```html
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
```

**Important:** This script MUST be added first, before the ChartFlow runtime script.

### Step 3: Add ChartFlow Runtime (Second Script)

Copy and paste this CDN script **below** the Chart.js script:

```html
<script src="https://cdn.jsdelivr.net/npm/@r2eagle/chartflow@1.0.0/dist/runtime.min.js"></script>
```

**Important:** Replace `@1.0.0` with the specific version you want to use. Using pinned versions ensures your charts remain stable and predictable.

**Version Options:**
- `@1.0.0` - Exact version (recommended for production)
- `@1.0` - Latest patch version (e.g., 1.0.x - gets bug fixes automatically)
- `@1` - Latest minor version (e.g., 1.x.x - gets new features automatically)
- `@latest` - Always latest (not recommended - may include breaking changes)

### Step 4: Save and Publish

1. Click **Save** in the Page Settings dialog
2. **Publish your site** (Cmd+Shift+P or click the Publish button)
3. Wait for publishing to complete

### Step 5: Verify Installation

Open your published site and check the browser console (F12 → Console tab):

**Expected output:**
```
ChartFlow: Found 1 chart(s)
ChartFlow: Initialized chart chart-[id]
```

Your charts should now be visible and interactive on the published site!

---

## One-Time Setup

These scripts only need to be added **once per page**. All charts on that page will work automatically.

**Pro Tip:** If you want charts to work site-wide, add these scripts to the **Site Settings → Custom Code** instead of Page Settings. This applies them to all pages.

---

## Updating ChartFlow Runtime

When a new version of ChartFlow is released, you can update by changing the version number in the CDN URL:

### Option 1: Manual Update (Recommended)
1. Go to Page Settings → Custom Code
2. Find the ChartFlow runtime script
3. Update the version number:
   ```html
   <!-- Change from: -->
   <script src="https://cdn.jsdelivr.net/npm/@r2eagle/chartflow@1.0.0/dist/runtime.min.js"></script>

   <!-- To: -->
   <script src="https://cdn.jsdelivr.net/npm/@r2eagle/chartflow@1.0.1/dist/runtime.min.js"></script>
   ```
4. Save and Publish

### Option 2: Automatic Updates (Use with Caution)
Use version ranges to get automatic updates:
```html
<!-- Gets all bug fixes in 1.0.x automatically -->
<script src="https://cdn.jsdelivr.net/npm/@r2eagle/chartflow@1.0/dist/runtime.min.js"></script>

<!-- Gets all features in 1.x.x automatically -->
<script src="https://cdn.jsdelivr.net/npm/@r2eagle/chartflow@1/dist/runtime.min.js"></script>
```

**Warning:** Automatic updates may introduce breaking changes. Test thoroughly before using in production.

---

## Troubleshooting

### Charts not appearing?

**Check the browser console** (F12 → Console):

| Console Message | Issue | Solution |
|----------------|-------|----------|
| `ChartFlow: Chart.js required` | Chart.js didn't load | Verify Chart.js CDN script is added and comes BEFORE the runtime script |
| `ChartFlow: No charts found` | No chart elements on page | Use the ChartFlow extension to insert a chart first |
| No console output at all | Runtime script not loaded | Verify you added the runtime script and published the site |
| `Canvas is already in use` | Script ran multiple times | This is harmless - refresh the page to clear |

### Still having issues?

1. **Clear browser cache** - Hard refresh with Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
2. **Verify scripts are in correct order** - Chart.js CDN must come first
3. **Check you're viewing the published site** - Scripts don't run in Designer preview
4. **Open browser DevTools** - Look for JavaScript errors in the Console tab

---

## FAQ

**Q: Do I need to add scripts for every chart?**
A: No! Add the scripts once per page (or site-wide in Site Settings), and all charts will work.

**Q: Why don't charts show in Designer preview?**
A: Custom scripts only run on published sites, not in the Designer. Charts will appear after publishing.

**Q: Can I use different Chart.js versions?**
A: Yes, but ChartFlow is tested with Chart.js 4.4.1. Update the CDN URL to use a different version.

**Q: Where can I find the CDN URL again?**
A: The ChartFlow extension shows the CDN URL in the browser console every time you insert a chart. You can also find it in this SETUP.md file or check the latest version at [npmjs.com/package/@r2eagle/chartflow](https://www.npmjs.com/package/@r2eagle/chartflow).

---

## Support

Need help? Check the [Chart.js documentation](https://www.chartjs.org/docs/latest/) for chart customization options.
