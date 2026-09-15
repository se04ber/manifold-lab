import type { EffectiveField, GeometryParameters, InitialState, Trajectory } from './types';

/** The period of the compact fiber coordinate under y ~ y + 2*pi*R. Mirrors
 * physics/src/Geometry.jl's `fiber_period`. */
export function fiberPeriod(radius: number): number {
	return 2 * Math.PI * radius;
}

/** Momentum along the compact fiber looks like electric charge: q = kappa * p5.
 * Mirrors physics/src/KaluzaKlein.jl's `effective_charge`. */
export function effectiveCharge(coupling: number, fiberMomentum: number): number {
	return coupling * fiberMomentum;
}

/** The schematic, spatially-uniform gauge field this toy model reads off the
 * metric ansatz. Mirrors physics/src/KaluzaKlein.jl's `effective_field`. */
export function effectiveField(params: GeometryParameters): EffectiveField {
	return {
		radius: params.radius,
		coupling: params.coupling,
		components: [0, params.coupling * params.fieldStrength]
	};
}

function wrap(value: number, period: number): number {
	return ((value % period) + period) % period;
}

type State4 = [number, number, number, number]; // x, z, vx, vz

function add(a: State4, b: State4): State4 {
	return [a[0] + b[0], a[1] + b[1], a[2] + b[2], a[3] + b[3]];
}

function scale(a: State4, s: number): State4 {
	return [a[0] * s, a[1] * s, a[2] * s, a[3] * s];
}

/** One RK4 step of du/dt = f(u), fixed h. For our constant-acceleration
 * equation of motion this is exact (no truncation error), not just an
 * approximation — RK4 integrates cubic polynomials exactly, and the exact
 * solution here is quadratic in t. */
function rk4Step(f: (u: State4) => State4, u: State4, h: number): State4 {
	const k1 = f(u);
	const k2 = f(add(u, scale(k1, h / 2)));
	const k3 = f(add(u, scale(k2, h / 2)));
	const k4 = f(add(u, scale(k3, h)));
	return add(u, scale(add(add(k1, scale(k2, 2)), add(scale(k3, 2), k4)), h / 6));
}

/**
 * Integrates the visible (base-space) part of a higher-dimensional free
 * trajectory under the effective field from `effectiveField`. Mirrors
 * physics/src/Geodesics.jl's `geodesic` — see fixtures/reference/*-p5.json
 * and neutral-geodesic.json for the values this must reproduce.
 *
 * A particle with fiber momentum p5 acquires effective charge
 * q = kappa * p5, which in the schematic uniform field A = (0, kappa *
 * fieldStrength) feels a constant force along the second base coordinate —
 * the Kaluza–Klein analogue of the Lorentz force law.
 */
export function geodesic(
	initial: InitialState,
	params: GeometryParameters,
	{ tMax = 4, nSamples = 120 }: { tMax?: number; nSamples?: number } = {}
): Trajectory {
	const q = effectiveCharge(params.coupling, initial.fiberMomentum);
	const acceleration: [number, number] = [0, q * params.fieldStrength];
	const rhs = (u: State4): State4 => [u[2], u[3], acceleration[0], acceleration[1]];
	const h = tMax / (nSamples - 1);
	const period = fiberPeriod(params.radius);

	let u: State4 = [
		initial.position[0],
		initial.position[1],
		initial.velocity[0],
		initial.velocity[1]
	];
	const t: number[] = [0];
	const position: [number, number][] = [[u[0], u[1]]];
	const fiber: number[] = [wrap(0, period)];

	for (let i = 1; i < nSamples; i++) {
		u = rk4Step(rhs, u, h);
		const ti = i * h;
		t.push(ti);
		position.push([u[0], u[1]]);
		fiber.push(wrap(initial.fiberMomentum * ti, period));
	}

	return { t, position, fiber, effectiveCharge: q };
}
