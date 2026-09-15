import type {
	GeometryParameters,
	InitialState,
	KKParameters,
	KKSpectrum,
	PhysicsEngine,
	Trajectory
} from './types';
import { kkSpectrum } from './kk';
import { effectiveField, geodesic } from './geodesic';

/** The only `PhysicsEngine` implementation for the MVP — see
 * `PhysicsEngine` in types.ts for why this boundary exists. */
export class TypeScriptPhysicsEngine implements PhysicsEngine {
	kkSpectrum(params: KKParameters): KKSpectrum {
		return kkSpectrum(params);
	}

	geodesic(initial: InitialState, params: GeometryParameters): Trajectory {
		return geodesic(initial, params);
	}

	effectiveField(params: GeometryParameters) {
		return effectiveField(params);
	}
}
