<script lang="ts">
	import './layout.css';
	import { onMount, type Snippet } from 'svelte';
	import { goto } from '$app/navigation';
	import { get } from 'svelte/store';
	import {
		gameState,
		running,
		speed,
		start,
		stop,
		setSpeed,
		hardReset,
		initialized
	} from '$lib/game/gameStore';
	import { money } from '$lib/game/utils';

	let needsSetup = $state(true);

	onMount(() => {
		const c = get(initialized);
		needsSetup = c === false;
		if (needsSetup && location.pathname !== '/setup') goto('/setup');
	});

	const { children }: { children: Snippet } = $props();

	console.log({ initialized });
</script>

{@render children()}

<div class="fixed bottom-4 left-1/2 z-50 w-[min(980px,calc(100%-2rem))] -translate-x-1/2">
	<div
		class="flex flex-wrap items-center justify-between gap-2 rounded-2xl border bg-white/90 p-3 shadow-sm backdrop-blur"
	>
		<div class="flex items-center gap-3">
			<a href="/" class="text-sm font-semibold text-gray-900 hover:underline">Dashboard</a>
			<a href="/products" class="text-sm text-gray-700 hover:underline">Software</a>
			<a href="/team" class="text-sm text-gray-700 hover:underline">Team</a>
			<a href="/profile" class="text-sm text-gray-700 hover:underline">Profile</a>
		</div>

		<div class="flex items-center gap-2">
			<div class="flex items-center gap-2 text-xs text-gray-600">
				<span
					class="inline-block h-2.5 w-2.5 rounded-full"
					style={`background:${$gameState.company.companyColor}`}
				></span>
				<span class="font-semibold text-gray-900">{$gameState.company.companyName}</span>
				<span class="text-gray-400">•</span>
				<span class="text-gray-700">{$gameState.company.playerName}</span>
				<span class="text-gray-400">•</span>
				Day <span class="font-semibold text-gray-900">{$gameState.company.day}</span>
				<span class="text-gray-400">•</span>
				Cash <span class="font-semibold text-gray-900">{money($gameState.company.cash)}</span>
			</div>
		</div>
		<div class="flex items-center gap-2">
			<button
				class="rounded-lg border px-3 py-2 text-sm font-medium hover:bg-gray-50"
				onclick={() => ($running ? stop() : start())}
			>
				{$running ? 'Pause' : 'Play'}
			</button>

			<div class="flex overflow-hidden rounded-lg border">
				<button class="px-3 py-2 text-sm hover:bg-gray-50" onclick={() => setSpeed(1)}>1x</button>
				<button class="px-3 py-2 text-sm hover:bg-gray-50" onclick={() => setSpeed(2)}>2x</button>
				<button class="px-3 py-2 text-sm hover:bg-gray-50" onclick={() => setSpeed(5)}>5x</button>
			</div>

			<button class="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50" onclick={hardReset}>
				Reset
			</button>
		</div>
	</div>
</div>
