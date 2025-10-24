# Environment Configuration

## Convex URL Setup

The demo application uses the `NGX_CONVEX_URL` environment variable to configure the Convex backend connection.

### Local Development

For local development with Convex dev server:

```bash
export NGX_CONVEX_URL=http://localhost:3000
bun nx serve demo
```

Or create a `.env.local` file:

```bash
# .env.local
NGX_CONVEX_URL=http://localhost:3000
```

The development environment (`environment.development.ts`) has a default value of `http://localhost:3000` as fallback.

### Production Build

For production builds, the environment variable must be set:

```bash
export NGX_CONVEX_URL=https://your-deployment.convex.cloud
bun nx build demo
```

### CI/CD Configuration

The CI workflow is configured to use the `NGX_CONVEX_URL` repository secret:

1. **GitHub Repository Settings** → **Secrets and variables** → **Actions**
2. Add a new repository secret: `NGX_CONVEX_URL`
3. Set the value to your Convex deployment URL

The CI workflow (`.github/workflows/ci.yml`) automatically injects this secret as an environment variable during builds and tests.

### How It Works

1. **Vite Configuration** (`apps/demo/vite.config.mts`):
   - Reads `process.env.NGX_CONVEX_URL` at build time
   - Injects it as `import.meta.env.NGX_CONVEX_URL` in the application

2. **Environment File** (`apps/demo/src/environments/environment.ts`):
   - Reads `import.meta.env.NGX_CONVEX_URL` at runtime
   - Falls back to empty string if not set

3. **App Configuration** (`apps/demo/src/app/app.config.ts`):
   - Uses `environment.convexUrl` to configure the Convex provider

### Troubleshooting

If you see connection errors or the app can't connect to Convex:

1. Verify the environment variable is set:

   ```bash
   echo $NGX_CONVEX_URL
   ```

2. For local development, ensure Convex dev server is running:

   ```bash
   npx convex dev
   ```

3. Check the browser console for connection errors

4. Verify the URL format:
   - Local: `http://localhost:3000` (or the port shown by `convex dev`)
   - Production: `https://your-deployment.convex.cloud`
