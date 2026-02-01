<script lang="ts">
	import { gameState, refreshApplicants, hireApplicant, fire } from '$lib/game/gameStore';
	import { money } from '$lib/game/utils';
</script>

<div class="mx-auto max-w-6xl p-6 pb-28">
	<h1 class="text-2xl font-semibold text-gray-900">Team</h1>

	<div class="mt-4 grid gap-4 md:grid-cols-3">
		<div class="rounded-2xl border bg-white p-4">
			<div class="flex items-center justify-between">
				<div>
					<h2 class="text-base font-semibold text-gray-900">Applicants</h2>
					<p class="mt-1 text-sm text-gray-600">Hire specific people with levels + salaries.</p>
				</div>
				<button
					class="rounded-lg border px-3 py-2 text-sm font-semibold hover:bg-gray-50"
					on:click={refreshApplicants}
				>
					Refresh
				</button>
			</div>

			<div class="mt-3 space-y-2">
				{#each $gameState.company.applicants as a (a.id)}
					<div class="rounded-xl bg-gray-50 p-3">
						<div class="flex items-start justify-between gap-3">
							<div>
								<div class="text-sm font-semibold text-gray-900">{a.name}</div>
								<div class="flex flex-wrap items-center gap-x-1 text-xs text-gray-600">
									<span>
										{a.skills.map((s) => `${s.role} (${s.proficiency})`).join(', ')}
									</span>
									<span>• {money(a.salaryPerDay)}/day</span>
								</div>
								<div class="mt-1 text-xs text-gray-600">
									Signing bonus: <span class="font-semibold text-gray-900"
										>{money(a.signingBonus)}</span
									>
								</div>
							</div>

							<button
								class="rounded-lg px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
								style={`background:${$gameState.company.companyColor}`}
								disabled={$gameState.company.cash < a.signingBonus}
								on:click={() => hireApplicant(a.id)}
							>
								Hire
							</button>
						</div>
					</div>
				{/each}
			</div>
		</div>

		<div class="space-y-3 md:col-span-2">
			{#each $gameState.company.employees as e (e.id)}
				<div class="rounded-2xl border bg-white p-4">
					<div class="flex items-center justify-between gap-3">
						<div>
							<div class="text-sm font-semibold text-gray-900">{e.name}</div>
							<div class="flex flex-wrap items-center gap-x-1 text-xs text-gray-600">
								<span>
									{e.skills.map((s) => `${s.role} (${s.proficiency})`).join(', ')}
								</span>
								<span>• {money(e.salaryPerDay)}/day</span>
							</div>
						</div>

						<button
							class="rounded-lg border px-3 py-2 text-sm font-semibold hover:bg-gray-50 disabled:opacity-50"
							disabled={e.salaryPerDay === 0}
							title={e.salaryPerDay === 0 ? 'You can’t fire the founder (v1)' : 'Fire employee'}
							on:click={() => fire(e.id)}
						>
							Fire
						</button>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>
