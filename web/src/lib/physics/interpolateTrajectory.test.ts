import { describe, expect, it } from 'vitest';
import { sampleTrajectory } from './interpolateTrajectory';
import type { Trajectory } from './types';

const trajectory: Trajectory = {
	t: [0, 1, 2],
	position: [
		[0, 0],
		[1, 2],
		[2, 4]
	],
	fiber: [0, 0.5, 1],
	effectiveCharge: 1
};

describe('sampleTrajectory', () => {
	it('returns exact samples at known times', () => {
		expect(sampleTrajectory(trajectory, 1)).toEqual({ position: [1, 2], fiber: 0.5 });
	});

	it('interpolates linearly between samples', () => {
		expect(sampleTrajectory(trajectory, 0.5)).toEqual({ position: [0.5, 1], fiber: 0.25 });
	});

	it('clamps before the start and after the end', () => {
		expect(sampleTrajectory(trajectory, -1)).toEqual({ position: [0, 0], fiber: 0 });
		expect(sampleTrajectory(trajectory, 5)).toEqual({ position: [2, 4], fiber: 1 });
	});
});
