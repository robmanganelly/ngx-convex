import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('displays welcome message and navigation', async ({ page }) => {
    await page.goto('/');

    // Check hero heading
    const heading = page.locator('h1');
    await expect(heading).toContainText('Welcome to NGX Convex');

    // Check navigation bar
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('nav >> text=NGX Convex')).toBeVisible();
    await expect(page.locator('nav >> text=Home')).toBeVisible();
    await expect(page.locator('nav >> text=Todos')).toBeVisible();
  });

  test('displays hero description', async ({ page }) => {
    await page.goto('/');

    await expect(
      page.locator('text=A powerful Angular integration with Convex')
    ).toBeVisible();
  });

  test('displays call-to-action buttons', async ({ page }) => {
    await page.goto('/');

    const getStartedButton = page.locator('a:has-text("Get Started")');
    const githubButton = page.locator('a:has-text("View on GitHub")');

    await expect(getStartedButton).toBeVisible();
    await expect(githubButton).toBeVisible();
    await expect(githubButton).toHaveAttribute(
      'href',
      'https://github.com/robmanganelly/ngx-convex'
    );
  });

  test('displays feature cards', async ({ page }) => {
    await page.goto('/');

    // Check for feature cards
    await expect(page.locator('text=Fast & Reactive')).toBeVisible();
    await expect(page.locator('text=Real-time updates with Angular signals')).toBeVisible();
    await expect(page.locator('text=Easy Setup')).toBeVisible();
    await expect(page.locator('text=Simple configuration and setup')).toBeVisible();
  });

  test('navigates to todos page when clicking Get Started', async ({
    page,
  }) => {
    await page.goto('/');

    await page.click('a:has-text("Get Started")');
    await expect(page).toHaveURL(/.*\/todos/);
    await expect(page.locator('h1:has-text("Todo List")')).toBeVisible();
  });

  test('navigates to todos page via navigation link', async ({ page }) => {
    await page.goto('/');

    await page.click('nav >> a:has-text("Todos")');
    await expect(page).toHaveURL(/.*\/todos/);
  });
});
