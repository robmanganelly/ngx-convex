# E2E Test Setup

## Overview

The e2e test suite includes two categories of tests:

1. **UI/Navigation Tests** - Test the UI elements, navigation, and client-side behavior
2. **Integration Tests** - Test the full stack including Convex backend

## Environment Setup

The demo app requires the `NGX_CONVEX_URL` environment variable to connect to Convex:

```bash
export NGX_CONVEX_URL=https://your-deployment.convex.cloud
```


```bash
NGX_CONVEX_URL=http://localhost:3000
```

## Running Tests

### Quick UI Tests (No Backend Required)

Run only the tests that don't require Convex:

```bash
bun nx e2e demo-e2e --grep "@ui"
```

### Full Integration Tests (Requires Convex)

To run the full test suite including Convex integration:

1. **Start Convex dev server** (in a separate terminal):

   ```bash
   npx convex dev
   ```

2. **Update app config** to use localhost Convex URL:

   - Edit `apps/demo/src/app/app.config.ts`
   - Change the Convex URL to your local dev URL (shown in convex dev output)

3. **Run all tests**:

   ```bash
   bun nx e2e demo-e2e
   ```

## Test Reports

After running tests, you can view detailed reports in the `reports/demo/` directory:

- **HTML Report**: `reports/demo/html/index.html` (open in browser)
- **JSON Report**: `reports/demo/json/results.json`
- **JUnit XML**: `reports/demo/junit/results.xml`
- **Screenshots/Videos**: `dist/.playwright/apps/demo-e2e/test-output/`

To view the HTML report:

```bash
open reports/demo/html/index.html
# or
npx playwright show-report reports/demo/html
```

## Current Test Status

- ✅ Home page tests (6 tests) - All passing
- ✅ Todos UI tests (3 tests) - Navigation, layout, form validation
- ⚠️ Todos integration tests (8 tests) - Require Convex backend to be running

## Known Issues

The integration tests for todos CRUD operations will timeout if:

- Convex dev server is not running
- App config points to an unavailable Convex deployment
- Network connectivity issues

These tests will show "Adding..." state stuck and todos not appearing, with errors like:

```text
Error: expect(locator).toBeVisible() failed
Timeout: 5000ms
Error: element(s) not found
```

## Troubleshooting

If tests fail with timeouts on todo operations:

1. Verify Convex is running: `npx convex dev`
2. Check browser console in test screenshots for error messages
3. Review video recordings in `dist/.playwright/apps/demo-e2e/test-output/`
4. Check error-context.md files for page state snapshots
