/**
 * Shared physics contract for Manifold Lab.
 *
 * Units: everything here is dimensionless. Lengths (radius) are expressed
 * relative to a reference compactification radius R0 = 1; masses and
 * momenta are expressed in units of 1/R0; ħ = c = 1. This mirrors the
 * convention documented in physics/src/ManifoldLab.jl — the two must stay
 * in lockstep, which is exactly what the fixtures in fixtures/reference/
 * exist to enforce.
 */

/** Everything a UI control panel can vary; the single source of truth for
 * one experiment's state. */
export type SimulationParameters = {
	radius: number;
	coupling: number;
	hiddenMomentum: number;
	mode: number;
	fieldStrength: number;
	initialVelocity: [number, number];
	simulationSpeed: number;
};

export type KKParameters = {
	radius: number;
	baseMass: number;
	/** Highest KK mode to include in the returned tower. */
	maxMode: number;
};

export type KKSpectrum = {
	radius: number;
	baseMass: number;
	/** m_n for n = 0..maxMode, i.e. modes[n] = sqrt(baseMass^2 + n^2 / radius^2). */
	modes: number[];
};

export type GeometryParameters = {
	radius: number;
	coupling: number;
	fieldStrength: number;
};

/** A point in the higher-dimensional base spacetime plus the compact fiber
 * coordinate y (the source of the "extra" dimension). */
export type InitialState = {
	position: [number, number];
	velocity: [number, number];
	/** Momentum along the compact fiber direction (p5 in the spec). */
	fiberMomentum: number;
};

export type Trajectory = {
	/** Sample times, strictly increasing. */
	t: number[];
	/** Higher-dimensional positions, one per sample time. */
	position: [number, number][];
	/** Fiber coordinate y at each sample time (mod 2*pi*radius). */
	fiber: number[];
	/** Lower-dimensional effective charge implied by the fiber momentum. */
	effectiveCharge: number;
};

/** The effective gauge connection A_mu induced by the geometry, per the
 * metric ansatz ds^2 = g_{mu nu} dx^mu dx^nu + R^2 (dy + kappa A_mu dx^mu)^2. */
export type EffectiveField = {
	radius: number;
	coupling: number;
	/** Schematic A_mu components; this is a toy 2D base, so just (A_t, A_x). */
	components: [number, number];
};

export type ReferenceScenario = {
	name: string;
	params: SimulationParameters;
};

export interface PhysicsEngine {
	kkSpectrum(params: KKParameters): KKSpectrum;
	geodesic(initial: InitialState, params: GeometryParameters): Trajectory;
	effectiveField(params: GeometryParameters): EffectiveField;
}
