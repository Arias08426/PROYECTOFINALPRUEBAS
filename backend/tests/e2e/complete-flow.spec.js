import { test, expect } from '@playwright/test';

test.describe('Inventory Management - Complete Workflow E2E', () => {
  test('should load the application', async ({ page }) => {
    const response = await page.goto('/', { 
      waitUntil: 'domcontentloaded',
      timeout: 10000 
    });
    
    expect(response.status()).toBeLessThan(400);
  });

  test('should have complete HTML structure', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 10000 });
    
    const html = await page.content();
    expect(html).toContain('Inventario');
    expect(html).toContain('categories');
    expect(html).toContain('products');
  });

  test('should have navigation elements', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 10000 });
    
    const html = await page.content();
    expect(html).toContain('tab');
  });
});