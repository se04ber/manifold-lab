import type { Trajectory } from './types';

/** Linear interpolation of a precomputed `Trajectory` at time `t`, clamped
 * to the trajectory's own time range. Used to animate a trajectory that was
 * computed once (debounced) rather than re-integrating every frame. */
export function sampleTrajectory(
	trajectory: Trajectory,
	t: number
): { position: [number, number]; fiber: number } {
	const times = trajectory.t;
	const n = times.length;
	if (n === 0) return { position: [0, 0], fiber: 0 };
	if (t <= times[0]) return { position: trajectory.position[0], fiber: trajectory.fiber[0] };
	if (t >= times[n - 1]) {
		return { position: trajectory.position[n - 1], fiber: trajectory.fiber[n - 1] };
	}

	let hi = 1;
	while (hi < n - 1 && times[hi] < t) hi++;
	const lo = hi - 1;
	const span = times[hi] - times[lo];
	const frac = span > 0 ? (t - times[lo]) / span : 0;

	const [x0, z0] = trajectory.position[lo];
	const [x1, z1] = trajectory.position[hi];
	return {
		position: [x0 + (x1 - x0) * frac, z0 + (z1 - z0) * frac],
		fiber: trajectory.fiber[lo] + (trajectory.fiber[hi] - trajectory.fiber[lo]) * frac
	};
}
