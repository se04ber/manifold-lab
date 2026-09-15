import type { SimulationParameters } from '$lib/physics/types';
import { defaultSimulationParameters } from './simulationParameters.svelte';

/** Maps each `SimulationParameters` field to its URL query key. An
 * experiment only lists the subset of fields it actually exposes as
 * controls, so unrelated params don't clutter its URL. */
export type ParamUrlKeys = Partial<Record<keyof SimulationParameters, string>>;

function parseNumber(value: string | null, fallback: number): number {
	if (value === null) return fallback;
	const parsed = Number(value);
	return Number.isFinite(parsed) ? parsed : fallback;
}

/** Read a `SimulationParameters` object out of a URL's search params,
 * falling back to `defaults` (typically `defaultSimulationParameters`) for
 * anything missing or malformed. */
export function readParamsFromSearch(
	search: URLSearchParams,
	keys: ParamUrlKeys,
	defaults: SimulationParameters = defaultSimulationParameters
): SimulationParameters {
	const result = { ...defaults };
	for (const [field, key] of Object.entries(keys) as [keyof SimulationParameters, string][]) {
		if (field === 'initialVelocity') continue; // vectors aren't URL-synced in the MVP
		const raw = search.get(key);
		if (raw === null) continue;
		(result[field] as number) = parseNumber(raw, defaults[field] as number);
	}
	return result;
}

/** Build the search-param string for the given fields of `params`, omitting
 * any that still equal their default (keeps shared URLs short). */
export function paramsToSearch(
	params: SimulationParameters,
	keys: ParamUrlKeys,
	defaults: SimulationParameters = defaultSimulationParameters
): URLSearchParams {
	const search = new URLSearchParams();
	for (const [field, key] of Object.entries(keys) as [keyof SimulationParameters, string][]) {
		if (field === 'initialVelocity') continue;
		const value = params[field] as number;
		if (value !== (defaults[field] as number)) {
			search.set(key, String(value));
		}
	}
	return search;
}
