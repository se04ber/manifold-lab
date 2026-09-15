import { test, expect, type Page } from '@playwright/test';

async function dragSlider(page: Page, index: number, value: string) {
	const slider = page.locator('input[type=range]').nth(index);
	await slider.fill(value);
	await slider.dispatchEvent('input');
	await slider.dispatchEvent('change');
}

test.describe('lab index', () => {
	test('links to all four experiments', async ({ page }) => {
		await page.goto('/lab');
		await expect(page.getByRole('heading', { name: 'Experiments' })).toBeVisible();
		for (const title of [
			'01 · Compact Dimension',
			'02 · Geometry → Gauge Field',
			'03 · Momentum → Effective Charge',
			'04 · Kaluza–Klein Tower'
		]) {
			await expect(page.getByRole('link', { name: title })).toBeVisible();
		}
	});
});

test.describe('Experiment 01: Compact Dimension', () => {
	test('loads, responds to R, and updates the URL', async ({ page }) => {
		await page.goto('/lab/compact-circle');
		await expect(page.getByRole('heading', { name: 'Compact Dimension' })).toBeVisible();
		await dragSlider(page, 0, '2.2');
		await expect(page).toHaveURL(/r=2\.2/);
	});

	test('restores state from a shared URL', async ({ page }) => {
		await page.goto('/lab/compact-circle?r=2.2');
		await expect(page.getByText('2.20')).toBeVisible();
	});
});

test.describe('Experiment 02: Geometry to Gauge Field', () => {
	test('loads and responds to field strength', async ({ page }) => {
		await page.goto('/lab/geometry-to-gauge');
		await expect(page.getByRole('heading', { name: 'Geometry → Gauge Field' })).toBeVisible();
		await dragSlider(page, 2, '-1.2');
		await expect(page).toHaveURL(/a=-1\.2/);
	});
});

test.describe('Experiment 03: Momentum to Effective Charge', () => {
	test('shows neutral, positive, and negative charge readouts', async ({ page }) => {
		await page.goto('/lab/momentum-to-charge?p5=0');
		await expect(page.getByText('neutral')).toBeVisible();

		await page.goto('/lab/momentum-to-charge?p5=2');
		await expect(page.getByText('positive')).toBeVisible();

		await page.goto('/lab/momentum-to-charge?p5=-2');
		await expect(page.getByText('negative')).toBeVisible();
	});
});

test.describe('Experiment 04: Kaluza-Klein Tower', () => {
	test('loads and the first-excitation shortcut updates the URL', async ({ page }) => {
		await page.goto('/lab/kk-spectrum');
		await expect(page.getByRole('heading', { name: 'Kaluza–Klein Tower' })).toBeVisible();
		await page.getByRole('button', { name: 'First KK excitation' }).click();
		await expect(page).toHaveURL(/n=1/);
		await expect(page.getByText('m1 = ', { exact: false })).toBeVisible();
	});
});
