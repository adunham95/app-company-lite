import { get } from 'svelte/store';
import { redirect } from '@sveltejs/kit';
import { gameState } from '$lib/game/gameStore';
import { browser } from '$app/environment';

export const load = ({ url }) => {
	// IMPORTANT: don't run redirect logic on the server
	if (!browser) return;

	const state = get(gameState);

	// Typical meaning:
	// initialized=false -> must go to setup
	if (!state.initialized && url.pathname !== '/setup') {
		throw redirect(302, '/setup');
	}

	// If initialized, don't allow setup page
	if (state.initialized && url.pathname === '/setup') {
		throw redirect(302, '/');
	}
};
