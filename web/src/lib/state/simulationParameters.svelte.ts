import type { SimulationParameters } from '$lib/physics/types';

export const defaultSimulationParameters: SimulationParameters = {
	radius: 1,
	coupling: 1,
	hiddenMomentum: 0,
	mode: 0,
	fieldStrength: 0,
	initialVelocity: [1, 0],
	simulationSpeed: 1
};

/** One reactive `SimulationParameters` object for an experiment. Every
 * control writes into this; every consumer (3D scene, equations, plot)
 * reads from it — never a locally-recomputed copy of the same quantity. */
export function createSimulationParameters(
	initial: Partial<SimulationParameters> = {}
): SimulationParameters {
	const state = $state({ ...defaultSimulationParameters, ...initial });
	return state;
}
