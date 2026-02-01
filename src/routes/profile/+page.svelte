<script lang="ts">
	import { gameState, setCompanyName, setPlayerName, setCompanyColor } from '$lib/game/gameStore';

	let companyName = $state($gameState.company.companyName);
	let playerName = $state($gameState.company.playerName);
	let companyColor = $state($gameState.company.companyColor);

	function save() {
		setCompanyName(companyName);
		setPlayerName(playerName);
		setCompanyColor(companyColor);
	}
</script>

<div class="mx-auto max-w-3xl p-6 pb-28">
	<h1 class="text-2xl font-semibold text-gray-900">Profile</h1>
	<p class="mt-1 text-sm text-gray-600">Update your company identity.</p>

	<div class="mt-4 space-y-3 rounded-2xl border bg-white p-4">
		<div>
			<label class="text-sm font-semibold text-gray-900">Company Name</label>
			<input class="mt-1 w-full rounded-lg border px-3 py-2 text-sm" bind:value={companyName} />
		</div>

		<div>
			<label class="text-sm font-semibold text-gray-900">Player Name</label>
			<input class="mt-1 w-full rounded-lg border px-3 py-2 text-sm" bind:value={playerName} />
		</div>

		<div>
			<label class="text-sm font-semibold text-gray-900">Company Color</label>
			<div class="mt-1 flex items-center gap-3">
				<input type="color" class="h-10 w-14 rounded border" bind:value={companyColor} />
				<input class="w-full rounded-lg border px-3 py-2 text-sm" bind:value={companyColor} />
			</div>
		</div>

		<div class="flex gap-2">
			<button
				class="rounded-lg px-3 py-2 text-sm font-semibold text-white"
				style={`background:${companyColor}`}
				on:click={save}
			>
				Save
			</button>
			<button
				class="rounded-lg border px-3 py-2 text-sm font-semibold hover:bg-gray-50"
				on:click={() => {
					companyName = $gameState.company.companyName;
					playerName = $gameState.company.playerName;
					companyColor = $gameState.company.companyColor;
				}}
			>
				Reset
			</button>
		</div>
	</div>
</div>
