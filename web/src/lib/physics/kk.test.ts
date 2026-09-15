import { describe, expect, it } from 'vitest';
import { kkMass, kkSpectrum } from './kk';
import { loadFixture, assertCloseTo } from './testing/compareToFixture';
import type { KKSpectrum } from './types';

describe('kkMass', () => {
	it('reduces to n/radius for a massless base field', () => {
		expect(kkMass(0, 0, 1)).toBe(0);
		expect(kkMass(1, 0, 1)).toBeCloseTo(1);
		expect(kkMass(2, 0, 2)).toBeCloseTo(1);
	});

	it('combines base mass and fiber momentum in quadrature', () => {
		expect(kkMass(2, 0.5, 2)).toBeCloseTo(Math.sqrt(0.5 ** 2 + 2 ** 2 / 2 ** 2));
	});
});

describe('kkSpectrum reproduces the Julia reference fixture', () => {
	it('matches fixtures/reference/kk-spectrum.json', () => {
		const expected = loadFixture<KKSpectrum>('kk-spectrum.json');
		const actual = kkSpectrum({
			radius: expected.radius,
			baseMass: expected.baseMass,
			maxMode: expected.modes.length - 1
		});
		assertCloseTo(actual, expected);
	});
});
