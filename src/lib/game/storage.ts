import type { GameState } from './gameTypes';

// NEW KEY (no backwards compatibility)
const KEY = 'software-inc-lite.v1.save.market-competition-rating-hiring';

export function saveToLocalStorage(state: GameState) {
	try {
		localStorage.setItem(KEY, JSON.stringify(state));
	} catch (e) {
		console.error('Save failed', e);
	}
}

export function loadFromLocalStorage(): GameState | null {
	try {
		const raw = localStorage.getItem(KEY);
		if (!raw) return null;
		return JSON.parse(raw) as GameState;
	} catch (e) {
		console.error('Load failed', e);
		return null;
	}
}

export function clearSave() {
	try {
		localStorage.removeItem(KEY);
	} catch (e) {
		console.error('Clear failed', e);
	}
}
