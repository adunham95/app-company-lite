<script lang="ts">
	import { gameState, getProduct, canRelease, release } from '$lib/game/gameStore';
	import type { SoftwareProduct } from '$lib/game/gameTypes';
	import { money, stars } from '$lib/game/utils';

	type Props = { params: { id: string } };
	const { params }: Props = $props();

	const product = $derived(() => {
		const state = $gameState;
		return (state.company.products.find((p) => p.id === params.id) ??
			null) as SoftwareProduct | null;
	});

	function pct(done: number, total: number) {
		if (total <= 0) return 100;
		return Math.max(0, Math.min(100, Math.floor((done / total) * 100)));
	}

	function reqProgress(r: any) {
		const designDone = r.designTotal - r.designRemaining;
		const devDone = r.devTotal - r.devRemaining;
		const total = r.designTotal + r.devTotal;
		const done = designDone + devDone;
		return pct(done, total);
	}
</script>

{#if !product}
	<div class="mx-auto max-w-4xl p-6 pb-28">
		<div class="rounded-2xl border bg-white p-6 text-sm text-gray-700">Software not found.</div>
	</div>
{:else}
	<div class="mx-auto max-w-4xl p-6 pb-28">
		<div class="flex items-start justify-between gap-3">
			<div>
				<h1 class="text-2xl font-semibold text-gray-900">{product?.name}</h1>
				<p class="mt-1 text-sm text-gray-600">{product()?.description}</p>
				<p class="mt-2 text-xs text-gray-500">
					{product()?.released ? `Released (Day ${product()?.releasedAtDay})` : 'In development'}
					• Type: {product()?.type}
				</p>
			</div>

			<div class="flex flex-col gap-2">
				<button
					class="cursor-pointer rounded-lg px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
					style={`background:${$gameState.company.companyColor}`}
					disabled={!canRelease(product()?.id) || product()?.released}
					onclick={() => release(product()?.id)}
				>
					{product()?.released ? 'Released' : 'Release'}
				</button>

				<a
					href="/products"
					class="cursor-pointer rounded-lg border px-3 py-2 text-center text-sm font-semibold hover:bg-gray-50"
				>
					Back
				</a>
			</div>
		</div>

		<div class="mt-6 grid gap-3 sm:grid-cols-5">
			<div class="rounded-xl bg-gray-50 p-3 text-sm">
				<div class="flex justify-between">
					<span class="text-gray-600">Quality</span><span class="font-semibold"
						>{product()?.quality}</span
					>
				</div>
			</div>
			<div class="rounded-xl bg-gray-50 p-3 text-sm">
				<div class="flex justify-between">
					<span class="text-gray-600">Feature Score</span><span class="font-semibold"
						>{product()?.featureScore}</span
					>
				</div>
			</div>
			<div class="rounded-xl bg-gray-50 p-3 text-sm">
				<div class="flex justify-between">
					<span class="text-gray-600">Rating</span><span class="font-semibold"
						>{product()?.rating?.toFixed(1) || 0} / 5</span
					>
				</div>
				<div class="mt-1 text-xs text-gray-600">{stars(product()?.rating || 0)}</div>
			</div>
			<div class="rounded-xl bg-gray-50 p-3 text-sm">
				<div class="flex justify-between">
					<span class="text-gray-600">Users</span><span class="font-semibold"
						>{product()?.users.toLocaleString()}</span
					>
				</div>
			</div>
			<!-- <div class="rounded-xl bg-gray-50 p-3 text-sm">
				<div class="flex justify-between">
					<span class="text-gray-600">Rev/day</span><span class="font-semibold"
						>{money(
							Math.floor((product()?.users || 0) * (product()?. || 0))
						)}</span
					>
				</div>
			</div> -->
		</div>

		<div class="mt-6 rounded-2xl border bg-white p-4">
			<div class="flex items-center justify-between gap-3">
				<h2 class="text-base font-semibold text-gray-900">Requirements</h2>
				<div class="text-xs text-gray-500">
					Designers & Developers automatically work these until complete.
				</div>
			</div>

			<div class="mt-4 space-y-2">
				{#each product()?.requirements as r (r.id)}
					<div class="rounded-xl bg-gray-50 p-3">
						<div class="flex items-start justify-between gap-3">
							<div>
								<div class="text-sm font-semibold text-gray-900">
									{r.name}
									{#if r.kind === 'base'}
										<span
											class="ml-2 rounded-full bg-gray-200 px-2 py-0.5 text-[11px] font-semibold text-gray-700"
											>Base</span
										>
									{:else}
										<span
											class="ml-2 rounded-full bg-indigo-100 px-2 py-0.5 text-[11px] font-semibold text-indigo-700"
											>Feature</span
										>
									{/if}
									{#if r.completed}
										<span
											class="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-semibold text-green-700"
											>Done</span
										>
									{/if}
								</div>
								{#if r.description}
									<div class="mt-1 text-xs text-gray-600">{r.description}</div>
								{/if}
								<div class="mt-2 text-[11px] text-gray-500">
									Remaining: {Math.ceil(r.designRemaining)} design / {Math.ceil(r.devRemaining)} dev
								</div>
							</div>

							<div class="text-right text-xs text-gray-600">
								<div>Impact</div>
								<div class="font-semibold text-gray-900">
									+{r.featureValue} feat • +{r.qualityValue} qual
								</div>
							</div>
						</div>

						<div class="mt-3 h-2 w-full rounded-full bg-gray-200">
							<div
								class="h-2 rounded-full transition-all"
								style={`width:${reqProgress(r)}%; background:${$gameState.company.companyColor};`}
							/>
						</div>
					</div>
				{/each}
			</div>

			{#if !product()?.released}
				<div class="mt-4 rounded-xl border bg-white p-3 text-sm text-gray-700">
					{#if canRelease(product()?.id)}
						✅ All requirements complete. You can release!
					{:else}
						⏳ Still building. Hire more design/dev to finish faster.
					{/if}
				</div>
			{/if}
		</div>

		{#if product()?.released}
			<div class="mt-6 rounded-2xl border bg-white p-4">
				<h2 class="text-base font-semibold text-gray-900">Post-release</h2>
				<div class="mt-3 grid gap-3 sm:grid-cols-2">
					<div class="rounded-xl bg-gray-50 p-3 text-sm">
						<div class="flex justify-between">
							<span class="text-gray-600">Marketing pressure</span><span class="font-semibold"
								>{Math.floor(product()?.marketingPressure || 0)}</span
							>
						</div>
						<div class="mt-1 text-xs text-gray-500">Hire marketing to grow users faster.</div>
					</div>
					<div class="rounded-xl bg-gray-50 p-3 text-sm">
						<div class="flex justify-between">
							<span class="text-gray-600">Support level</span><span class="font-semibold"
								>{Math.floor(product()?.supportLevel || 0)}</span
							>
						</div>
						<div class="mt-1 text-xs text-gray-500">Hire support to reduce churn.</div>
					</div>
				</div>
			</div>

			{@const market = $gameState.company.markets.find((m) => m.type === product()?.type)}
			{#if market}
				<div class="mt-6 rounded-2xl border bg-white p-4">
					<h2 class="text-base font-semibold text-gray-900">Market</h2>
					<p class="mt-1 text-sm text-gray-600">
						Size: {market.size.toLocaleString()} users • Competitors fight for the same pool.
					</p>

					<div class="mt-3 space-y-2">
						{#each market.competitors as c (c.id)}
							<div class="flex items-center justify-between rounded-xl bg-gray-50 p-3 text-sm">
								<div>
									<div class="font-semibold text-gray-900">{c.name}</div>
									<div class="text-xs text-gray-600">
										Rating {c.rating.toFixed(1)} • Marketing {Math.floor(c.marketingPressure)}
									</div>
								</div>
								<div class="font-semibold text-gray-900">{c.users.toLocaleString()} users</div>
							</div>
						{/each}
					</div>
				</div>
			{/if}
		{/if}
	</div>
{/if}
