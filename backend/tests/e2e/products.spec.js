import { test, expect } from '@playwright/test';

test.describe('Inventory Management - Products E2E', () => {
  test('should load the application', async ({ page }) => {
    const response = await page.goto('/', { 
      waitUntil: 'domcontentloaded',
      timeout: 10000 
    });
    
    expect(response.status()).toBeLessThan(400);
  });

  test('should have products section', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 10000 });
    
    const html = await page.content();
    expect(html).toContain('products');
  });

  test('should have tab navigation', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 10000 });
    
    const html = await page.content();
    expect(html).toContain('tab');
  });
});