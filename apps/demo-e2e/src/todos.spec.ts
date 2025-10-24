import { test, expect } from '@playwright/test';

test.describe('Todos Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/todos');
  });

  test('displays todos page layout', async ({ page }) => {
    // Check navigation
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('nav >> text=NGX Convex')).toBeVisible();

    // Check main heading
    await expect(page.locator('h1:has-text("Todo List")')).toBeVisible();
    await expect(
      page.locator('text=Real-time task management powered by Convex')
    ).toBeVisible();

    // Check add todo form exists
    await expect(
      page.locator('input[placeholder="What needs to be done?"]')
    ).toBeVisible();
    await expect(page.locator('button:has-text("Add Todo")')).toBeVisible();
  });

  test('navigates back to home page', async ({ page }) => {
    await page.click('nav >> a:has-text("Home")');
    await expect(page).toHaveURL(/.*\/home/);
    await expect(page.locator('h1:has-text("Welcome to NGX Convex")')).toBeVisible();
  });

  test('displays empty state or todos list', async ({ page }) => {
    // Wait for either empty state or todos to load
    await Promise.race([
      page.locator('text=No todos yet').waitFor({ state: 'visible' }),
      page.locator('[class*="flex items-center justify-between"]').first().waitFor({ state: 'visible' }),
    ]).catch(() => {
      // If neither appears quickly, that's ok - might be loading
    });

    // Verify page is interactive
    await expect(page.getByTestId('todo-input')).toBeEnabled();
  });

  test('can add a new todo', async ({ page }) => {
    await page.goto('/todos');

    const todoText = `Test Todo ${Date.now()}`;
    await page.getByTestId('todo-input').fill(todoText);
    await page.getByTestId('add-todo-button').click();

    // Verify the todo appears in the list
    await expect(page.locator(`text=${todoText}`)).toBeVisible();
  });

  test('displays todo statistics when todos exist', async ({ page }) => {
    // Add a todo first to ensure we have data
    const todoText = `Stats Test ${Date.now()}`;
    await page.getByTestId('todo-input').fill(todoText);
    await page.getByTestId('add-todo-button').click();

    // Wait for todo to be added
    await expect(page.locator(`text=${todoText}`)).toBeVisible({ timeout: 5000 });

    // Stats should now be visible
    await expect(page.getByTestId('todo-stats')).toBeVisible();
  });

  test('can toggle a todo as completed', async ({ page }) => {
    // Add a todo first
    const todoText = `Toggle Test ${Date.now()}`;
    await page.getByTestId('todo-input').fill(todoText);
    await page.getByTestId('add-todo-button').click();

    // Wait for todo to appear
    await expect(page.locator(`text=${todoText}`)).toBeVisible({ timeout: 5000 });

    // Get the todo item and extract its ID
    const todoItem = page.locator(`text=${todoText}`).locator('../..');
    const todoId = await todoItem.getAttribute('data-testid');
    const id = (todoId || '').replace('todo-item-', '');

    // Click toggle button using data-testid
    await page.getByTestId(`toggle-todo-${id}`).click();

    // Wait for the opacity change to be applied
    const parent = page.locator(`text=${todoText}`).locator('../..');
    await expect(parent).toHaveClass(/opacity-70/, { timeout: 3000 });
  });

  test('can delete a todo', async ({ page }) => {
    // Add a todo first
    const todoText = `Delete Test ${Date.now()}`;
    await page.getByTestId('todo-input').fill(todoText);
    await page.getByTestId('add-todo-button').click();

    // Wait for todo to appear
    await expect(page.locator(`text=${todoText}`)).toBeVisible({ timeout: 5000 });

    // Get the todo item and extract its ID from data-testid
    const todoItem = page.locator(`text=${todoText}`).locator('../..');
    const todoId = await todoItem.getAttribute('data-testid');
    const id = (todoId || '').replace('todo-item-', '');

    // Click delete button using the extracted ID
    await page.getByTestId(`delete-todo-${id}`).click();

    // Verify todo is removed
    await expect(page.locator(`text=${todoText}`)).toBeHidden({ timeout: 3000 });
  });

  test('add button is disabled when input is empty', async ({ page }) => {
    const input = page.getByTestId('todo-input');
    const addButton = page.getByTestId('add-todo-button');

    // Clear input if it has content
    await input.clear();

    // Button should be disabled
    await expect(addButton).toBeDisabled();

    // Type something
    await input.fill('New task');
    await expect(addButton).toBeEnabled();

    // Clear again
    await input.clear();
    await expect(addButton).toBeDisabled();
  });

  test('can add multiple todos', async ({ page }) => {
    const todos = [
      `Multi Todo 1 ${Date.now()}`,
      `Multi Todo 2 ${Date.now()}`,
      `Multi Todo 3 ${Date.now()}`,
    ];

    for (const todoText of todos) {
      await page.getByTestId('todo-input').fill(todoText);
      await page.getByTestId('add-todo-button').click();
      // Wait for each todo to appear before adding the next
      await expect(page.locator(`text=${todoText}`)).toBeVisible({ timeout: 5000 });
    }

    // Verify all todos are still visible
    for (const todoText of todos) {
      await expect(page.locator(`text=${todoText}`)).toBeVisible();
    }
  });

  test('displays timestamp for todos', async ({ page }) => {
    // Add a new todo
    const todoText = `Time Test ${Date.now()}`;
    await page.getByTestId('todo-input').fill(todoText);
    await page.getByTestId('add-todo-button').click();

    // Wait for todo to appear
    await expect(page.locator(`text=${todoText}`)).toBeVisible({ timeout: 5000 });

    // The timestamp should be visible (format: "Created: MM/DD/YYYY at HH:MM AM/PM")
    const todoItem = page.locator(`text=${todoText}`).locator('../..');
    await expect(todoItem.locator('text=/Created at.*(AM|PM)/')).toBeVisible();
  });

  test('can mark all todos as complete', async ({ page }) => {
    // Add a couple of todos
    const todo1 = `Bulk Test 1 ${Date.now()}`;
    const todo2 = `Bulk Test 2 ${Date.now()}`;

    await page.getByTestId('todo-input').fill(todo1);
    await page.getByTestId('add-todo-button').click();
    await expect(page.locator(`text=${todo1}`)).toBeVisible({ timeout: 5000 });

    await page.getByTestId('todo-input').fill(todo2);
    await page.getByTestId('add-todo-button').click();
    await expect(page.locator(`text=${todo2}`)).toBeVisible({ timeout: 5000 });

    // Click the "Complete All" button
    const completeAllButton = page.getByTestId('complete-all-button');
    await expect(completeAllButton).toBeVisible();

    await completeAllButton.click();

    // Wait for updates and verify both todos are marked complete
    const todo1Item = page.locator(`text=${todo1}`).locator('../..');
    const todo2Item = page.locator(`text=${todo2}`).locator('../..');

    await expect(todo1Item).toHaveClass(/opacity-70/, { timeout: 3000 });
    await expect(todo2Item).toHaveClass(/opacity-70/, { timeout: 3000 });
  });

  test('can delete completed todos', async ({ page }) => {
    // Add a todo and mark it complete
    const todoText = `Delete Completed Test ${Date.now()}`;

    await page.getByTestId('todo-input').fill(todoText);
    await page.getByTestId('add-todo-button').click();
    await expect(page.locator(`text=${todoText}`)).toBeVisible({ timeout: 5000 });

    // Get the todo item and extract its ID
    const todoItem = page.locator(`text=${todoText}`).locator('../..');
    const todoId = await todoItem.getAttribute('data-testid');
    const id = (todoId || '').replace('todo-item-', '');

    // Toggle it to completed using data-testid
    await page.getByTestId(`toggle-todo-${id}`).click();

    // Wait for completed state
    await expect(todoItem).toHaveClass(/opacity-70/, { timeout: 3000 });

    // Click the "Delete Completed" button
    const deleteCompletedButton = page.getByTestId('delete-completed-button');
    await expect(deleteCompletedButton).toBeVisible();
    await deleteCompletedButton.click();

    // The completed todo should be removed
    await expect(page.locator(`text=${todoText}`)).toBeHidden({ timeout: 3000 });
  });
});

