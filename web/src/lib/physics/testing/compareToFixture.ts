import { expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve as resolvePath } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
// web/src/lib/physics/testing -> repo root is four levels up
const FIXTURES_DIR = resolvePath(here, '../../../../../fixtures/reference');

const RELATIVE_TOLERANCE = 1e-6;
const ABSOLUTE_TOLERANCE = 1e-9;

export function loadFixture<T>(filename: string): T {
	const path = resolvePath(FIXTURES_DIR, filename);
	return JSON.parse(readFileSync(path, 'utf-8')) as T;
}

function closeEnough(a: number, b: number): boolean {
	const diff = Math.abs(a - b);
	return (
		diff <= ABSOLUTE_TOLERANCE || diff <= RELATIVE_TOLERANCE * Math.max(Math.abs(a), Math.abs(b))
	);
}

/** Deep-compares numbers within tolerance (relative 1e-6, absolute 1e-9 near
 * zero) and everything else with strict equality, via real `expect()` calls
 * so failures show a proper diff and the path that diverged. */
export function assertCloseTo(actual: unknown, expected: unknown, path = '$'): void {
	if (typeof expected === 'number') {
		expect(typeof actual, `${path} should be a number`).toBe('number');
		expect(
			closeEnough(actual as number, expected),
			`${path}: expected ${expected}, got ${actual}`
		).toBe(true);
		return;
	}
	if (Array.isArray(expected)) {
		expect(Array.isArray(actual), `${path} should be an array`).toBe(true);
		expect((actual as unknown[]).length, `${path}.length`).toBe(expected.length);
		expected.forEach((item, i) => assertCloseTo((actual as unknown[])[i], item, `${path}[${i}]`));
		return;
	}
	if (expected !== null && typeof expected === 'object') {
		expect(actual !== null && typeof actual === 'object', `${path} should be an object`).toBe(true);
		for (const key of Object.keys(expected)) {
			assertCloseTo(
				(actual as Record<string, unknown>)[key],
				(expected as Record<string, unknown>)[key],
				`${path}.${key}`
			);
		}
		return;
	}
	expect(actual, path).toBe(expected);
}
