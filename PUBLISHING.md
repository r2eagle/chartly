# ChartFlow Publishing Guide

This guide explains how to publish ChartFlow runtime updates to npm and jsDelivr CDN using automated GitHub Actions.

## Prerequisites

✅ npm account (sign up at [npmjs.com](https://www.npmjs.com/signup))
✅ GitHub repository with push access
✅ npm access token with publish permissions

---

## Initial Setup (One-Time)

### 1. Create npm Access Token

1. Log in to [npmjs.com](https://www.npmjs.com)
2. Click your profile icon → **Access Tokens**
3. Click **Generate New Token** → **Classic Token**
4. Select **Automation** (for CI/CD)
5. Copy the token (starts with `npm_...`)

### 2. Add npm Token to GitHub Secrets

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `NPM_TOKEN`
5. Value: Paste your npm token from step 1
6. Click **Add secret**

### 3. Update package.json Metadata

Before publishing, update these fields in `package.json`:

```json
{
  "author": "Your Name <your.email@example.com>",
  "repository": {
    "type": "git",
    "url": "https://github.com/YOUR_USERNAME/chartflow.git"
  },
  "homepage": "https://github.com/YOUR_USERNAME/chartflow#readme",
  "bugs": {
    "url": "https://github.com/YOUR_USERNAME/chartflow/issues"
  }
}
```

Replace `YOUR_USERNAME` with your actual GitHub username.

### 4. Verify Build Works

Run locally to ensure everything builds correctly:

```bash
npm run build-runtime
```

You should see:
```
✅ ChartFlow runtime built successfully!
   📦 Minified: /path/to/dist/runtime.min.js (1257 bytes)
   📄 Readable: /path/to/dist/runtime.js (3245 bytes)
   📘 Types: /path/to/dist/runtime.d.ts
```

---

## Publishing a New Version

### Automated Publishing (Recommended)

The GitHub Actions workflow automatically publishes to npm when you push a version tag.

#### Step 1: Make Your Changes

Edit code, fix bugs, add features as needed.

#### Step 2: Bump Version

Use npm's built-in version command:

```bash
# For bug fixes (1.0.0 → 1.0.1)
npm version patch

# For new features (1.0.0 → 1.1.0)
npm version minor

# For breaking changes (1.0.0 → 2.0.0)
npm version major
```

This command will:
- Update version in `package.json`
- Create a git commit with the version change
- Create a git tag (e.g., `v1.0.1`)

#### Step 3: Push Tag to GitHub

```bash
# Push commit and tag
git push && git push --tags
```

#### Step 4: Watch GitHub Actions

1. Go to your GitHub repository
2. Click **Actions** tab
3. You'll see "Publish to npm" workflow running
4. Wait for it to complete (usually 1-2 minutes)

#### Step 5: Verify Publishing

After the workflow completes:

1. **Check npm:** Visit `https://www.npmjs.com/package/@r2eagle/chartflow`
2. **Check jsDelivr:** Within 5-10 minutes, your package will be available at:
   ```
   https://cdn.jsdelivr.net/npm/@r2eagle/chartflow@YOUR_VERSION/dist/runtime.min.js
   ```
3. **Check GitHub Releases:** A new release will be created automatically

---

## Manual Publishing (Fallback)

If you need to publish manually without GitHub Actions:

### Step 1: Build Runtime

```bash
npm run build-runtime
```

### Step 2: Test Package Contents

See what will be published:

```bash
npm pack --dry-run
```

This shows all files that will be included in the package.

### Step 3: Login to npm (First Time Only)

```bash
npm login
```

Enter your npm credentials.

### Step 4: Publish

```bash
npm publish --access public
```

The `--access public` flag is required for scoped packages.

---

## Versioning Strategy

Follow [Semantic Versioning](https://semver.org/):

- **MAJOR** version (X.0.0) - Breaking changes that require user action
- **MINOR** version (1.X.0) - New features, backwards compatible
- **PATCH** version (1.0.X) - Bug fixes, backwards compatible

### Examples:

| Change | Version Bump | Command |
|--------|--------------|---------|
| Fix double-initialization bug | 1.0.0 → 1.0.1 | `npm version patch` |
| Add new chart type support | 1.0.0 → 1.1.0 | `npm version minor` |
| Change data structure format | 1.0.0 → 2.0.0 | `npm version major` |

---

## Troubleshooting

### ❌ GitHub Actions Fails: "npm ERR! 403 Forbidden"

**Cause:** NPM_TOKEN secret is missing or expired.

**Solution:**
1. Generate new npm token
2. Update GitHub secret with new token
3. Re-run the workflow

### ❌ Package Name Already Taken

**Error:** `npm ERR! 403 403 Forbidden - PUT https://registry.npmjs.org/chartflow`

**Solution:** The package name `chartflow` is already taken. Update `package.json`:

```json
{
  "name": "@your-username/chartflow"
}
```

Then publish with your npm username as scope.

### ❌ GitHub Actions Can't Create Release

**Cause:** `GITHUB_TOKEN` doesn't have permissions.

**Solution:** The workflow already includes `permissions: contents: read`. If it still fails, check repository settings → Actions → General → Workflow permissions.

### ❌ jsDelivr Not Serving New Version

**Wait:** jsDelivr caches npm packages. It may take 5-10 minutes.

**Force Refresh:** Add a cache-busting parameter:
```
https://cdn.jsdelivr.net/npm/@r2eagle/chartflow@1.0.1/dist/runtime.min.js?v=2
```

### ❌ dist/ Files Not Building

**Cause:** Build script failed silently.

**Solution:**
1. Run `npm run build-runtime` manually
2. Check for errors in console
3. Verify `src/constants/scripts.ts` contains CHARTFLOW_RUNTIME_SCRIPT

---

## Updating Users

When you publish a new version:

### For Patch Releases (Bug Fixes)

Users on `@1.0` will automatically get the update within ~10 minutes via CDN cache.

### For Minor/Major Releases

1. Create a GitHub release with changelog
2. Notify users via:
   - GitHub Discussions
   - Documentation update
   - Social media
3. Include migration guide if needed

### CDN URL Update Instructions for Users

Users need to update their Webflow Page Settings:

```html
<!-- Old -->
<script src="https://cdn.jsdelivr.net/npm/@r2eagle/chartflow@1.0.0/dist/runtime.min.js"></script>

<!-- New -->
<script src="https://cdn.jsdelivr.net/npm/@r2eagle/chartflow@1.1.0/dist/runtime.min.js"></script>
```

---

## Testing Before Publishing

### Local Testing

1. Build runtime: `npm run build-runtime`
2. Check dist files exist: `ls -lh dist/`
3. Manually test runtime.min.js in a test Webflow site

### Dry Run

See what will be published without actually publishing:

```bash
npm pack --dry-run
```

### Test Installation

After publishing, test the package installs correctly:

```bash
npm install @r2eagle/chartflow@latest --registry=https://registry.npmjs.org
```

---

## Best Practices

✅ **Always test locally** before publishing
✅ **Use semantic versioning** consistently
✅ **Write clear commit messages** for version bumps
✅ **Document breaking changes** in release notes
✅ **Keep CHANGELOG.md updated** (consider creating one)
✅ **Test on a staging Webflow site** before releasing to users

---

## Questions?

- npm package: https://www.npmjs.com/package/@r2eagle/chartflow
- jsDelivr CDN: https://cdn.jsdelivr.net/npm/@r2eagle/chartflow
- GitHub Repository: https://github.com/r2eagle/chartly
