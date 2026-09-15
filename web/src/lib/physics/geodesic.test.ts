import { describe, expect, it } from 'vitest';
import { effectiveCharge, effectiveField, fiberPeriod, geodesic } from './geodesic';
import { loadFixture, assertCloseTo } from './testing/compareToFixture';
import type { GeometryParameters, InitialState, Trajectory } from './types';

const GEOMETRY: GeometryParameters = { radius: 1, coupling: 0.5, fieldStrength: 1 };

function initial(fiberMomentum: number): InitialState {
	return { position: [0, 0], velocity: [1, 0], fiberMomentum };
}

describe('fiberPeriod', () => {
	it('is 2*pi*R', () => {
		expect(fiberPeriod(1)).toBeCloseTo(2 * Math.PI);
		expect(fiberPeriod(2)).toBeCloseTo(4 * Math.PI);
	});
});

describe('effectiveCharge / effectiveField', () => {
	it('scales linearly with coupling and fiber momentum', () => {
		expect(effectiveCharge(0.5, 0)).toBe(0);
		expect(effectiveCharge(0.5, 2)).toBeCloseTo(1);
		expect(effectiveCharge(0.5, -2)).toBeCloseTo(-1);
	});

	it('reads off a schematic uniform field from geometry parameters', () => {
		expect(effectiveField(GEOMETRY).components).toEqual([0, 0.5]);
	});
});

describe('geodesic reproduces the Julia reference fixtures', () => {
	const cases: [string, number][] = [
		['neutral-geodesic.json', 0],
		['positive-p5.json', 2],
		['negative-p5.json', -2]
	];

	for (const [file, fiberMomentum] of cases) {
		it(`matches fixtures/reference/${file}`, () => {
			const expected = loadFixture<Trajectory>(file);
			const actual = geodesic(initial(fiberMomentum), GEOMETRY, { tMax: 4, nSamples: 20 });
			assertCloseTo(actual, expected);
		});
	}

	it('curves the opposite way for opposite-sign p5', () => {
		const positive = geodesic(initial(2), GEOMETRY);
		const negative = geodesic(initial(-2), GEOMETRY);
		expect(positive.position.at(-1)![1]).toBeGreaterThan(0);
		expect(negative.position.at(-1)![1]).toBeLessThan(0);
	});
});
