export function uid(prefix = 'id') {
	return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

export function clamp(n: number, min: number, max: number) {
	return Math.max(min, Math.min(max, n));
}

export function money(n: number) {
	return n.toLocaleString(undefined, {
		style: 'currency',
		currency: 'USD',
		maximumFractionDigits: 0
	});
}

export function stars(rating: number = 0) {
	const full = Math.floor(rating);
	const half = rating - full >= 0.5 ? 1 : 0;
	const empty = 5 - full - half;
	return '★'.repeat(full) + (half ? '☆' : '') + '✩'.repeat(empty);
}
