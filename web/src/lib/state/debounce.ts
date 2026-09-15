/** Delay `fn` until `waitMs` has passed with no further calls. Used to keep
 * expensive trajectory recalculation off the hot path of every slider tick,
 * while rendering/interpolation stays on every frame regardless. */
export function debounce<Args extends unknown[]>(
	fn: (...args: Args) => void,
	waitMs: number
): (...args: Args) => void {
	let timeout: ReturnType<typeof setTimeout> | undefined;
	return (...args: Args) => {
		clearTimeout(timeout);
		timeout = setTimeout(() => fn(...args), waitMs);
	};
}
