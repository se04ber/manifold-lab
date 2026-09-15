import type { KKParameters, KKSpectrum } from './types';

/** The n-th Kaluza–Klein mode mass: m_n = sqrt(baseMass^2 + n^2/radius^2). */
export function kkMass(n: number, baseMass: number, radius: number): number {
	return Math.sqrt(baseMass ** 2 + (n * n) / (radius * radius));
}

/** The Kaluza–Klein mass tower for n = 0..maxMode. Mirrors
 * physics/src/Spectra.jl's `kk_spectrum` — see fixtures/reference/kk-spectrum.json. */
export function kkSpectrum(params: KKParameters): KKSpectrum {
	const modes: number[] = [];
	for (let n = 0; n <= params.maxMode; n++) {
		modes.push(kkMass(n, params.baseMass, params.radius));
	}
	return { radius: params.radius, baseMass: params.baseMass, modes };
}
