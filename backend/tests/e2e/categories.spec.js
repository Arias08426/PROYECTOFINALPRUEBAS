import { test, expect } from '@playwright/test';

test.describe('Inventory Management - Categories E2E', () => {
  test('should load the application', async ({ page }) => {
    const response = await page.goto('/', { 
      waitUntil: 'domcontentloaded',
      timeout: 10000 
    });
    
    expect(response.status()).toBeLessThan(400);
  });

  test('should have HTML structure', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 10000 });
    
    const html = await page.content();
    expect(html).toContain('Inventario');
  });

  test('should have category section', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 10000 });
    
    const html = await page.content();
    expect(html).toContain('categories');
  });
});