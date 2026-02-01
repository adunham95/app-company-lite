import type { GameState, Phase, SoftwareProduct } from './gameTypes';
import { clamp } from './utils';

function employeeOutputPerDay(level: number) {
	return 10 + level * 4;
}

export function tickOneDay(state: GameState): GameState {
	const s: GameState = structuredClone(state);
	const c = s.company;

	c.day += 1;
	c.revenueToday = 0;
	c.expensesToday = 0;

	// payroll
	const payroll = c.employees.reduce((sum, e) => sum + e.salaryPerDay, 0);
	c.expensesToday += payroll;

	// output by role
	const out: Record<Phase, number> = { design: 0, development: 0, marketing: 0, support: 0 };
	for (const e of c.employees) {
		const base = employeeOutputPerDay(e.level);

		const total = e.skills.reduce((sum, s) => sum + s.proficiency, 0) || 1;

		for (const s of e.skills) {
			const share = s.proficiency / total; // sums to 1
			out[s.role] += base * share;
		}
	}

	// build unreleased products: burn down requirements
	const unreleased = c.products.filter((p) => !p.released);
	applyWorkToRequirements(unreleased, 'design', out.design, c.day);
	applyWorkToRequirements(unreleased, 'development', out.development, c.day);

	// competitors evolve daily
	for (const m of c.markets) {
		for (const comp of m.competitors) {
			comp.marketingPressure = Math.max(0, comp.marketingPressure * 0.99);
			comp.rating = clamp(comp.rating + (Math.random() - 0.5) * 0.03, 1, 5);
		}
	}

	// released products: marketing/support feeds pressure/level, then market competition allocates growth
	const released = c.products.filter((p) => p.released);

	// distribute marketing/support across released products evenly (simple v1)
	for (const p of released) {
		const mShare = released.length ? out.marketing / released.length : 0;
		const sShare = released.length ? out.support / released.length : 0;

		p.marketingPressure += mShare * 0.3;
		p.supportLevel += sShare * 0.25;

		p.marketingPressure = Math.max(0, p.marketingPressure * 0.98);
		p.supportLevel = Math.max(0, p.supportLevel * 0.996);

		// ✅ only recompute non-rating stats (featureScore, maybe bugs, etc.)
		recomputeProductStats(p);
	}

	// compete in market for each released product
	for (const p of released) {
		const market = c.markets.find((m) => m.type === p.type);
		if (!market) continue;

		const competitorUsers = market.competitors.reduce((sum, x) => sum + x.users, 0);
		const ourUsersInMarket = c.products
			.filter((x) => x.released && x.type === p.type)
			.reduce((sum, x) => sum + x.users, 0);

		const marketUsed = competitorUsers + ourUsersInMarket;
		const remainingMarket = Math.max(0, market.size - marketUsed);

		// today’s “new user pool” depends on how much market is left
		const marketNewUsersToday = Math.floor(remainingMarket * 0.0025);

		// attractiveness pool includes all our released products of this type + competitors
		const ourTypeProducts = c.products.filter((x) => x.released && x.type === p.type);

		const ourAttractivenessTotal = ourTypeProducts.reduce((sum, x) => {
			return sum + attractiveness(x.rating, x.marketingPressure, x.featureScore);
		}, 0);

		const compAttractivenessTotal = market.competitors.reduce((sum, x) => {
			return sum + attractiveness(x.rating, x.marketingPressure, 40); // competitor baseline
		}, 0);

		const totalAttractiveness = Math.max(1, ourAttractivenessTotal + compAttractivenessTotal);

		// our gained users is our share of the marketNewUsersToday
		const gained = Math.floor(
			marketNewUsersToday *
				(attractiveness(p.rating, p.marketingPressure, p.featureScore) / totalAttractiveness)
		);

		// churn for us
		const lost = computeChurn(p);

		p.users = Math.max(0, p.users + gained - lost);

		// competitors also move
		for (const comp of market.competitors) {
			const compShare =
				attractiveness(comp.rating, comp.marketingPressure, 40) / totalAttractiveness;
			const compGain = Math.floor(marketNewUsersToday * compShare);

			// competitor churn: smaller + rating-based
			const compChurnRate = 0.025 * (1 - clamp(comp.rating / 5, 0, 0.5));
			const compChurn = Math.floor(comp.users * compChurnRate);

			comp.users = Math.max(0, comp.users + compGain - compChurn);
		}

		// revenue
		if (p.isSubscription && p.dailyPrice) {
			c.revenueToday += Math.floor(p.users * p.dailyPrice);
		} else if (p.oneTimePrice) {
			c.revenueToday += Math.floor((gained - lost) * p.oneTimePrice);
		}
	}

	c.cash += c.revenueToday - c.expensesToday;
	return s;
}

function applyWorkToRequirements(
	products: SoftwareProduct[],
	phase: 'design' | 'development',
	points: number,
	day: number
) {
	if (points <= 0) return;

	const reqs = products
		.flatMap((p) => p.requirements.map((r) => r))
		.filter((r) => !r.completed)
		.filter((r) => (phase === 'design' ? r.designRemaining > 0 : r.devRemaining > 0));

	if (!reqs.length) return;

	const per = points / reqs.length;

	for (const r of reqs) {
		if (phase === 'design') r.designRemaining = Math.max(0, r.designRemaining - per);
		else r.devRemaining = Math.max(0, r.devRemaining - per);

		if (r.designRemaining <= 0 && r.devRemaining <= 0 && !r.completed) {
			r.completed = true;
			r.completedAtDay = day;
		}
	}
}

function recomputeProductStats(p: SoftwareProduct) {
	p.featureScore = clamp(Math.round(p.featureScore ?? 40), 0, 100);
}

function attractiveness(rating: number | null, marketingPressure: number, featureScore: number) {
	if (rating === null) {
		rating = 0;
	}
	return rating * 2.2 + marketingPressure * 0.06 + featureScore * 0.05;
}

function computeChurn(p: SoftwareProduct) {
	// churn reduced by rating + support
	const rating = p.rating || 0;
	const churnRate =
		0.03 * (1 - clamp(rating / 5, 0, 0.65)) * (1 - clamp(p.supportLevel / 240, 0, 0.6));

	return Math.floor(p.users * churnRate);
}
