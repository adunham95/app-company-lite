<script lang="ts">
	import { gameState, createSoftware } from '$lib/game/gameStore';
	import { SOFTWARE_TYPES, featuresForType } from '$lib/game/catalog';
	import { stars } from '$lib/game/utils';

	let type = $state<'game' | 'browser' | 'photo_editor' | 'ide'>('game');
	let name = $state('');
	let description = $state('');
	let isSubscription = $state(false);
	let dailyPrice = $state(3); // dollars per user per day (game-scale)
	let oneTimePrice = $state(49); // dollars per purchase (game-scale)

	let selected = $state<Record<string, boolean>>({});

	function resetSelections() {
		const list = featuresForType(type);
		selected = Object.fromEntries(list.map((f) => [f.id, false]));
	}

	function clampPrice(n: number, min: number, max: number) {
		if (Number.isNaN(n)) return min;
		return Math.max(min, Math.min(max, n));
	}

	$effect(() => {
		type;
		resetSelections();
	});

	function chosenIds() {
		return Object.entries(selected)
			.filter(([, v]) => v)
			.map(([k]) => k);
	}

	function create() {
		createSoftware({
			type,
			name,
			description,
			selectedFeatureIds: chosenIds(),
			isSubscription,
			dailyPrice,
			oneTimePrice
		});
		name = '';
		description = '';
		resetSelections();
	}
</script>

<div class="mx-auto max-w-6xl p-6 pb-28">
	<div class="flex items-end justify-between gap-3">
		<div>
			<h1 class="text-2xl font-semibold text-gray-900">Software</h1>
			<p class="mt-1 text-sm text-gray-600">
				Pick a type, select features, then your team builds the requirements.
			</p>
		</div>
	</div>

	<div class="mt-4 grid gap-4 md:grid-cols-3">
		<div class="rounded-2xl border bg-white p-4 md:col-span-1">
			<h2 class="text-base font-semibold text-gray-900">Create Software</h2>

			<div class="mt-3 space-y-3">
				<div>
					<label class="text-sm font-semibold text-gray-900">Type</label>
					<select class="mt-1 w-full rounded-lg border px-3 py-2 text-sm" bind:value={type}>
						{#each SOFTWARE_TYPES as t (t.id)}
							<option value={t.id}>{t.name}</option>
						{/each}
					</select>
					<div class="mt-1 text-xs text-gray-600">
						{SOFTWARE_TYPES.find((t) => t.id === type)?.blurb}
					</div>
				</div>

				<div>
					<label class="text-sm font-semibold text-gray-900">Name</label>
					<input
						class="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
						bind:value={name}
						placeholder="My Great App"
					/>
				</div>

				<div>
					<label class="text-sm font-semibold text-gray-900">Description</label>
					<textarea
						class="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
						rows="3"
						bind:value={description}
						placeholder="What does it do?"
					/>
				</div>

				<div class="rounded-xl bg-gray-50 p-3">
					<div class="text-sm font-semibold text-gray-900">Feature Selection</div>
					<div class="mt-2 space-y-2">
						{#each featuresForType(type) as f (f.id)}
							<label class="flex items-start gap-2 text-sm text-gray-700">
								<input type="checkbox" class="mt-1" bind:checked={selected[f.id]} />
								<div>
									<div class="font-medium text-gray-900">{f.name}</div>
									<div class="text-xs text-gray-600">{f.description}</div>
									<div class="mt-1 text-[11px] text-gray-500">
										Cost: {f.designCost} design / {f.devCost} dev • Impact: +{f.featureValue} features,
										+{f.qualityValue} quality
									</div>
								</div>
							</label>
						{/each}
					</div>
				</div>

				<div class="rounded-xl border bg-white p-3">
					<div class="flex items-start justify-between gap-3">
						<div>
							<div class="text-sm font-semibold text-gray-900">Pricing model</div>
							<div class="mt-0.5 text-xs text-gray-600">
								Choose subscription for recurring revenue, or one-time for a bigger upfront hit.
							</div>
						</div>

						<label class="inline-flex items-center gap-2 text-sm text-gray-700">
							<input type="checkbox" bind:checked={isSubscription} />
							<span class="font-medium">Subscription</span>
						</label>
					</div>

					{#if isSubscription}
						<div class="mt-3">
							<label class="text-sm font-semibold text-gray-900">Daily price (per user)</label>
							<div class="mt-1 flex items-center gap-2">
								<span class="text-sm text-gray-500">$</span>
								<input
									class="w-full rounded-lg border px-3 py-2 text-sm"
									type="number"
									min="1"
									step="1"
									bind:value={dailyPrice}
									onchange={() => (dailyPrice = clampPrice(dailyPrice, 1, 999))}
								/>
							</div>
							<div class="mt-1 text-xs text-gray-600">
								Revenue/day ≈ users × ${dailyPrice}
							</div>
						</div>
					{:else}
						<div class="mt-3">
							<label class="text-sm font-semibold text-gray-900">One-time price</label>
							<div class="mt-1 flex items-center gap-2">
								<span class="text-sm text-gray-500">$</span>
								<input
									class="w-full rounded-lg border px-3 py-2 text-sm"
									type="number"
									min="1"
									step="1"
									bind:value={oneTimePrice}
									onchange={() => (oneTimePrice = clampPrice(oneTimePrice, 1, 9999))}
								/>
							</div>
							<div class="mt-1 text-xs text-gray-600">
								Revenue happens on purchase days (when you gain users).
							</div>
						</div>
					{/if}
				</div>

				<button
					class="w-full rounded-lg px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
					style={`background:${$gameState.company.companyColor}`}
					disabled={!name.trim()}
					onclick={create}
				>
					Create
				</button>
			</div>
		</div>

		<div class="space-y-3 md:col-span-2">
			{#if $gameState.company.products.length === 0}
				<div class="rounded-2xl border bg-white p-6 text-sm text-gray-700">
					No software yet. Create one!
				</div>
			{:else}
				{#each $gameState.company.products as p (p.id)}
					<a
						href={`/products/${p.id}`}
						class="block rounded-2xl border bg-white p-4 hover:bg-gray-50"
					>
						<div class="flex items-start justify-between gap-3">
							<div>
								<div class="text-base font-semibold text-gray-900">{p.name}</div>
								<div class="mt-1 text-sm text-gray-600">{p.description}</div>
								<div class="mt-2 text-xs text-gray-500">
									{p.released ? `Released (Day ${p.releasedAtDay})` : 'In development'}
									• Type: {p.type}
									• Users: {p.users.toLocaleString()}
								</div>
								{#if p.released}
									<div class="mt-1 text-xs text-gray-600">
										Rating: {stars(p.rating)} ({p.rating.toFixed(1)})
									</div>
								{/if}
							</div>

							<div class="text-right text-xs text-gray-600">
								<div>Quality: <span class="font-semibold text-gray-900">{p.quality}</span></div>
								<div>
									Features: <span class="font-semibold text-gray-900">{p.featureScore}</span>
								</div>
							</div>
						</div>
					</a>
				{/each}
			{/if}
		</div>
	</div>
</div>
