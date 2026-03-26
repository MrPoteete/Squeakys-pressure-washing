// @ts-check
const { test, expect } = require('@playwright/test');
const path = require('path');

const PAGE_URL = `file://${path.resolve(__dirname, '../index.html')}`;

test.describe('Squeaky\'s Pressure Washing Landing Page', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(PAGE_URL);
  });

  // 1. All 6 sections render
  test('all 6 sections are present in the DOM', async ({ page }) => {
    await expect(page.locator('#hero')).toBeAttached();
    await expect(page.locator('#about')).toBeAttached();
    await expect(page.locator('#services')).toBeAttached();
    await expect(page.locator('#service-area')).toBeAttached();
    await expect(page.locator('#contact')).toBeAttached();
    await expect(page.locator('#footer, footer')).toBeAttached();
  });

  // 2. Nav is visible with business name and CTA
  test('nav contains business name and quote button', async ({ page }) => {
    const nav = page.locator('header, nav').first();
    await expect(nav).toBeVisible();
    await expect(nav).toContainText("Squeaky");
    await expect(page.locator('a:has-text("Quote"), a:has-text("Free Quote"), button:has-text("Quote")').first()).toBeVisible();
  });

  // 3. Hero headline is visible
  test('hero headline is visible', async ({ page }) => {
    const hero = page.locator('#hero');
    await expect(hero).toBeVisible();
    await expect(hero.locator('h1')).toBeVisible();
    const h1Text = await hero.locator('h1').textContent();
    expect(h1Text.toLowerCase()).toContain('squeaky');
  });

  // 4. Hero image slot and fallback
  test('hero has background image element', async ({ page }) => {
    const heroBgImg = page.locator('#hero img.hero-bg, .hero-bg');
    await expect(heroBgImg).toBeAttached();
  });

  // 5. All 6 service cards render
  test('services section has 6 cards', async ({ page }) => {
    await page.locator('#services').scrollIntoViewIfNeeded();
    const cards = page.locator('#services .service-card');
    await expect(cards).toHaveCount(6);
  });

  // 6. Service area section has placeholder badge pills
  test('service area section has badge pills', async ({ page }) => {
    await page.locator('#service-area').scrollIntoViewIfNeeded();
    await expect(page.locator('#service-area')).toBeVisible();
    const badges = page.locator('#service-area .badge, #service-area .pill, #service-area .area-badge, #service-area [class*="badge"], #service-area [class*="pill"]');
    const badgeCount = await badges.count();
    expect(badgeCount).toBeGreaterThanOrEqual(1);
  });

  // 7. Booking form fields are present
  test('booking form has all required fields', async ({ page }) => {
    await page.locator('#contact').scrollIntoViewIfNeeded();
    const form = page.locator('[data-form="booking"]');
    await expect(form).toBeAttached();
    await expect(form.locator('input[name*="name"], input[placeholder*="Name"], input[id*="name"]').first()).toBeAttached();
    await expect(form.locator('input[type="tel"], input[name*="phone"]').first()).toBeAttached();
    await expect(form.locator('input[type="email"]')).toBeAttached();
    await expect(form.locator('select')).toBeAttached();
    await expect(form.locator('textarea')).toBeAttached();
  });

  // 8. Form validation blocks empty submit
  test('form shows validation errors on empty submit', async ({ page }) => {
    await page.locator('#contact').scrollIntoViewIfNeeded();
    const submitBtn = page.locator('[data-form="booking"] button[type="submit"], [data-form="booking"] input[type="submit"]');
    await submitBtn.click();
    // Either HTML5 validation fires or JS adds .error classes
    const errorFields = page.locator('.form-group.error, .field-error, input:invalid');
    const errorCount = await errorFields.count();
    expect(errorCount).toBeGreaterThanOrEqual(1);
  });

  // 9. Footer contains placeholder contact info
  test('footer contains contact placeholders', async ({ page }) => {
    await page.locator('footer').scrollIntoViewIfNeeded();
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    const footerText = await footer.textContent();
    expect(footerText).toContain('Squeaky');
    // Check for phone or email placeholder
    expect(footerText.includes('555') || footerText.includes('@squeakys') || footerText.includes('hello@')).toBeTruthy();
  });

  // 10. Mobile layout — single column at 375px
  test('services grid collapses to single column on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.locator('#services').scrollIntoViewIfNeeded();
    const cards = page.locator('#services .service-card');
    const count = await cards.count();
    expect(count).toBe(6); // All cards still present

    // Check that the grid has collapsed (cards span full width)
    const firstCard = cards.first();
    const cardBox = await firstCard.boundingBox();
    expect(cardBox.width).toBeGreaterThanOrEqual(300); // Near full width on 375px screen
  });

  // 11. Scroll animations — fade-in class applied
  test('sections have fade-in class for scroll animation', async ({ page }) => {
    const fadeElements = page.locator('.fade-in');
    const count = await fadeElements.count();
    expect(count).toBeGreaterThan(0);
  });

  // 12. Smooth scroll nav links are anchor links
  test('nav links point to page anchors', async ({ page }) => {
    const navLinks = page.locator('header a[href^="#"], nav a[href^="#"]');
    const count = await navLinks.count();
    expect(count).toBeGreaterThanOrEqual(3);
  });

});
