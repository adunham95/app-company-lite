<script lang="ts">
	import { gameState } from '$lib/game/gameStore';
	import { money, stars } from '$lib/game/utils';

	const released = $derived($gameState.company.products.filter((p) => p.released));
	const unreleased = $derived($gameState.company.products.filter((p) => !p.released));
	const topReleased = $derived([...released].sort((a, b) => b.users - a.users).slice(0, 3));
</script>

<div class="mx-auto max-w-6xl p-6 pb-28">
	<div class="flex items-end justify-between gap-3">
		<div>
			<div class="flex items-center gap-2">
				<span
					class="inline-block h-3 w-3 rounded-full"
					style={`background:${$gameState.company.companyColor}`}
				/>
				<h1 class="text-2xl font-semibold text-gray-900">{$gameState.company.companyName}</h1>
			</div>
			<p class="mt-1 text-sm text-gray-600">Founder: {$gameState.company.playerName}</p>
		</div>
	</div>

	<div class="mt-4 grid gap-4 md:grid-cols-3">
		<div class="rounded-2xl border bg-white p-4">
			<div class="text-sm text-gray-600">Cash</div>
			<div class="mt-1 text-2xl font-semibold">{money($gameState.company.cash)}</div>
			<div class="mt-2 text-xs text-gray-600">
				Today: +{money($gameState.company.revenueToday)} / -{money(
					$gameState.company.expensesToday
				)}
			</div>
		</div>

		<div class="rounded-2xl border bg-white p-4">
			<div class="text-sm text-gray-600">Team</div>
			<div class="mt-1 text-2xl font-semibold">{$gameState.company.employees.length}</div>
			<div class="mt-2 text-xs text-gray-600">Hire design/dev to finish software faster.</div>
		</div>

		<div class="rounded-2xl border bg-white p-4">
			<div class="text-sm text-gray-600">Software</div>
			<div class="mt-1 text-sm text-gray-800">
				<div>In development: <span class="font-semibold">{unreleased.length}</span></div>
				<div>Released: <span class="font-semibold">{released.length}</span></div>
			</div>
			<div class="mt-3 flex gap-2">
				<a
					href="/products"
					class="rounded-lg px-3 py-2 text-sm font-semibold text-white"
					style={`background:${$gameState.company.companyColor}`}
				>
					Create / Manage
				</a>
				<a href="/team" class="rounded-lg border px-3 py-2 text-sm font-semibold hover:bg-gray-50">
					Hire
				</a>
			</div>
		</div>
	</div>

	<div class="mt-6 grid gap-4 md:grid-cols-2">
		<div class="rounded-2xl border bg-white p-4">
			<h2 class="text-base font-semibold text-gray-900">Top Products</h2>
			{#if topReleased.length === 0}
				<div class="mt-3 text-sm text-gray-700">No released products yet.</div>
			{:else}
				<div class="mt-3 space-y-2">
					{#each topReleased as p (p.id)}
						<a href={`/products/${p.id}`} class="block rounded-xl bg-gray-50 p-3 hover:bg-gray-100">
							<div class="flex items-start justify-between gap-3">
								<div>
									<div class="text-sm font-semibold text-gray-900">{p.name}</div>
									<div class="text-xs text-gray-600">
										{p.type} • {stars(p.rating)} ({p.rating.toFixed(1)})
									</div>
								</div>
								<div class="text-sm font-semibold text-gray-900">
									{p.users.toLocaleString()} users
								</div>
							</div>
						</a>
					{/each}
				</div>
			{/if}
		</div>

		<div class="rounded-2xl border bg-white p-4">
			<h2 class="text-base font-semibold text-gray-900">Quick stats</h2>
			<div class="mt-3 space-y-2 text-sm text-gray-700">
				<div class="flex justify-between">
					<span>Revenue today</span><span class="font-semibold"
						>{money($gameState.company.revenueToday)}</span
					>
				</div>
				<div class="flex justify-between">
					<span>Expenses today</span><span class="font-semibold"
						>{money($gameState.company.expensesToday)}</span
					>
				</div>
				<div class="flex justify-between">
					<span>Net today</span><span class="font-semibold"
						>{money($gameState.company.revenueToday - $gameState.company.expensesToday)}</span
					>
				</div>
			</div>
		</div>
	</div>
</div>
