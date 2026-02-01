<script lang="ts">
	import { goto } from '$app/navigation';
	import {
		gameState,
		setCompanyName,
		setPlayerName,
		setCompanyColor,
		setInitialized
	} from '$lib/game/gameStore';

	let companyName = $state('');
	let playerName = $state('');
	let companyColor = $state($gameState.company.companyColor ?? '#7c3aed');

	function startGame() {
		setCompanyName(companyName);
		setPlayerName(playerName);
		setCompanyColor(companyColor);
		setInitialized();
		goto('/');
	}
</script>

<div class="mx-auto max-w-xl p-6 pb-28">
	<h1 class="text-2xl font-semibold text-gray-900">Start a new company</h1>
	<p class="mt-1 text-sm text-gray-600">Name your company and founder.</p>

	<div class="mt-4 space-y-3 rounded-2xl border bg-white p-4">
		<div>
			<label class="text-sm font-semibold text-gray-900">Company Name</label>
			<input
				class="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
				bind:value={companyName}
				placeholder="PixelForge Labs"
			/>
		</div>

		<div>
			<label class="text-sm font-semibold text-gray-900">Player Name</label>
			<input
				class="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
				bind:value={playerName}
				placeholder="Adrian"
			/>
		</div>

		<div>
			<label class="text-sm font-semibold text-gray-900">Company Color</label>
			<div class="mt-1 flex items-center gap-3">
				<input type="color" class="h-10 w-14 rounded border" bind:value={companyColor} />
				<input
					class="w-full rounded-lg border px-3 py-2 text-sm"
					bind:value={companyColor}
					placeholder="#7c3aed"
				/>
			</div>
		</div>

		<button
			class="w-full cursor-pointer rounded-lg px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
			style={`background:${companyColor}`}
			disabled={!companyName.trim() || !playerName.trim()}
			onclick={startGame}
		>
			Start
		</button>
	</div>
</div>
