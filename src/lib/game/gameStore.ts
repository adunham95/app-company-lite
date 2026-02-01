import { writable, get } from 'svelte/store';
import type {
	Applicant,
	Employee,
	EmployeeRole,
	GameState,
	Rating,
	SoftwareProduct,
	SoftwareType
} from './gameTypes';
import { loadFromLocalStorage, saveToLocalStorage, clearSave } from './storage';
import { tickOneDay } from './gameLogic';
import { uid } from './utils';
import {
	baseForType,
	featuresForType,
	MARKET_SIZES,
	COMPETITOR_SEEDS,
	COMPETITORS
} from './catalog';

type Speed = 1 | 2 | 5;

function newGame(): GameState {
	const types: SoftwareType[] = ['game', 'browser', 'photo_editor', 'ide'];

	return {
		version: 1,
		initialized: false,
		company: {
			day: 1,
			cash: 5000,
			revenueToday: 0,
			expensesToday: 0,

			companyName: 'New Company',
			playerName: 'Player',
			companyColor: '#7c3aed',

			employees: [
				{
					id: uid('emp'),
					name: 'Player',
					skills: [
						{ role: 'development', proficiency: 90 },
						{ role: 'design', proficiency: 90 },
						{ role: 'marketing', proficiency: 90 },
						{ role: 'support', proficiency: 90 }
					],
					level: 2,
					salaryPerDay: 0,
					hiredAtDay: 1
				}
			],

			applicants: [],

			products: [],

			markets: types.map((type) => ({
				type,
				size: MARKET_SIZES[type],
				competitors: COMPETITORS[type].map((seed) => ({
					id: uid('comp'),
					name: seed.name,
					type,
					users: seed.users,
					rating: seed.rating,
					marketingPressure: 40 + Math.random() * 80,
					pricePerUserPerDay: 0.12 + Math.random() * 0.08
				}))
			}))
		}
	};
}

/**
 * --- STORES ---
 */
const initial = loadFromLocalStorage() ?? newGame();

// Ensure applicant pool exists on load
if (!initial.company.applicants || initial.company.applicants.length === 0) {
	initial.company.applicants = [];
	for (let i = 0; i < 6; i++) initial.company.applicants.push(makeApplicant(initial.company.day));
}

// eslint-disable-next-line prefer-const
export let gameState = writable<GameState>(initial);
// eslint-disable-next-line prefer-const
export let running = writable(false);
// eslint-disable-next-line prefer-const
export let speed = writable<Speed>(1);
// eslint-disable-next-line prefer-const
export let initialized = writable<boolean>(false);

let timer: any = null;

function persist() {
	saveToLocalStorage(get(gameState));
}

/**
 * --- GAME LOOP ---
 */
export function start() {
	if (get(running)) return;
	running.set(true);

	timer = setInterval(() => {
		if (!get(running)) return;

		const s = get(speed);
		gameState.update((state) => {
			let next = state;
			for (let i = 0; i < s; i++) next = tickOneDay(next);
			return next;
		});

		persist();
	}, 5000);
}

export function stop() {
	running.set(false);
	if (timer) {
		clearInterval(timer);
		timer = null;
	}
}

export function setSpeed(next: Speed) {
	speed.set(next);
	if (get(running)) {
		stop();
		start();
	}
}

export function hardReset() {
	stop();
	clearSave();
	const fresh = newGame();
	// seed applicants
	fresh.company.applicants = [];
	for (let i = 0; i < 6; i++) fresh.company.applicants.push(makeApplicant(fresh.company.day));
	gameState.set(fresh);
}

/**
 * --- PROFILE ---
 */
export function setCompanyName(name: string) {
	const v = name.trim().slice(0, 50) || 'New Company';
	gameState.update((s) => {
		s.company.companyName = v;
		return s;
	});
	persist();
}

export function setPlayerName(name: string) {
	const v = name.trim().slice(0, 50) || 'Player';
	gameState.update((s) => {
		s.company.playerName = v;
		const founder = s.company.employees.find((e) => e.salaryPerDay === 0);
		if (founder) founder.name = v;
		return s;
	});
	persist();
}

export function setCompanyColor(hex: string) {
	const v = hex.trim();
	const ok = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(v);
	gameState.update((s) => {
		s.company.companyColor = ok ? v : '#7c3aed';
		return s;
	});
	persist();
}

/**
 * --- APPLICANTS / HIRING ---
 */
export function refreshApplicants() {
	gameState.update((s) => {
		const target = 6;
		while (s.company.applicants.length < target) {
			s.company.applicants.push(makeApplicant(s.company.day));
		}
		s.company.applicants = s.company.applicants.slice(0, target);
		return s;
	});
	persist();
}

export function hireApplicant(applicantId: string) {
	gameState.update((s) => {
		const idx = s.company.applicants.findIndex((a) => a.id === applicantId);
		if (idx === -1) return s;

		const a = s.company.applicants[idx];
		if (s.company.cash < a.signingBonus) return s;

		const e: Employee = {
			id: uid('emp'),
			name: a.name,
			skills: a.skills,
			level: a.level,
			salaryPerDay: a.salaryPerDay,
			hiredAtDay: s.company.day
		};

		s.company.cash -= a.signingBonus;
		s.company.employees.push(e);

		s.company.applicants.splice(idx, 1);
		while (s.company.applicants.length < 6) s.company.applicants.push(makeApplicant(s.company.day));
		return s;
	});
	persist();
}

export function fire(empId: string) {
	gameState.update((s) => {
		const emp = s.company.employees.find((e) => e.id === empId);
		if (!emp) return s;
		if (emp.salaryPerDay === 0) return s; // founder can't be fired (v1)
		s.company.employees = s.company.employees.filter((e) => e.id !== empId);
		return s;
	});
	persist();
}

/**
 * --- PRODUCTS ---
 */
export function createSoftware(input: {
	type: SoftwareType;
	name: string;
	description: string;
	selectedFeatureIds: string[];
	isSubscription: boolean;
	dailyPrice: number;
	oneTimePrice: number;
}) {
	gameState.update((s) => {
		const baseDefs = baseForType(input.type);
		const featureDefs = featuresForType(input.type);

		const baseReqs = baseDefs.map((b) => ({
			id: uid('req'),
			defId: b.id,
			kind: 'base' as const,
			name: b.name,
			description: b.description,

			designTotal: b.designCost,
			devTotal: b.devCost,
			designRemaining: b.designCost,
			devRemaining: b.devCost,

			completed: false,
			completedAtDay: null,

			featureValue: 2,
			qualityValue: b.qualityValue
		}));

		const allowed = new Set(featureDefs.map((f) => f.id));
		const featureReqs = input.selectedFeatureIds
			.filter((id) => allowed.has(id))
			.map((id) => {
				const f = featureDefs.find((x) => x.id === id)!;
				return {
					id: uid('req'),
					defId: f.id,
					kind: 'feature' as const,
					name: f.name,
					description: f.description,

					designTotal: f.designCost,
					devTotal: f.devCost,
					designRemaining: f.designCost,
					devRemaining: f.devCost,

					completed: false,
					completedAtDay: null,

					featureValue: f.featureValue,
					qualityValue: f.qualityValue
				};
			});

		const product: SoftwareProduct = {
			id: uid('prod'),
			type: input.type,
			name: input.name.trim() || 'Untitled Software',
			description: input.description?.trim() || '',

			released: false,
			releasedAtDay: null,

			users: 0,

			quality: 10,
			featureScore: 5,

			marketingPressure: 0,
			supportLevel: 0,

			isSubscription: input.isSubscription,
			dailyPrice: input.dailyPrice,
			oneTimePrice: input.oneTimePrice,

			qualityPoints: 0, // + when features completed, good hires, etc.
			bugs: 0, // - from rushed work, low skill, etc.

			// Locked at release
			rating: null, // set once at release
			popularity: 0,

			requirements: [...baseReqs, ...featureReqs]
		};

		s.company.products.unshift(product);
		return s;
	});
	persist();
}

export function getProduct(id: string) {
	return get(gameState).company.products.find((p) => p.id === id) ?? null;
}

export function canRelease(productId?: string) {
	if (!productId) {
		return false;
	}
	const p = getProduct(productId);
	if (!p) return false;
	return p.requirements.length > 0 && p.requirements.every((r) => r.completed);
}

export function release(productId?: string) {
	if (!productId) {
		return;
	}
	gameState.update((s) => {
		const p = s.company.products.find((x) => x.id === productId);
		if (!p || p.released) return s;
		if (!p.requirements.every((r) => r.completed)) return s;

		// one-time review at release
		const { rating, popularity } = rollReleaseReview(p);

		p.released = true;
		p.releasedAtDay = s.company.day;

		// lock these in
		p.rating = rating;
		p.popularity = popularity;

		return s;
	});
	persist();
}

function rollReleaseReview(p: any): { rating: Rating; popularity: number } {
	// If you have these later, wire them in:
	const bugs = Number(p.bugs ?? 0); // 0 if not present
	const polish = Number(p.polish ?? 0); // 0 if not present (optional)

	// Base score: start around "okay", then adjust
	let score = 60;

	// Penalize bugs, reward polish (tweak later)
	score -= bugs * 8;
	score += polish * 6;

	// Small randomness so releases vary a bit
	score += Math.round((Math.random() - 0.5) * 14); // -7..+7

	score = clamp(score, 0, 100);

	let rating: Rating;
	if (score >= 85) rating = 5;
	else if (score >= 70) rating = 4;
	else if (score >= 55) rating = 3;
	else if (score >= 40) rating = 2;
	else rating = 1;

	const popularityMap: Record<Rating, number> = {
		1: 0.15, // "maybe 1–2 sales"
		2: 0.35,
		3: 0.65,
		4: 1.0,
		5: 1.45 // super popular +++
	};

	return { rating, popularity: popularityMap[rating] };
}

/**
 * --- GAME SETTINGS ---
 */

export function setInitialized() {
	gameState.update((s) => {
		s.initialized = true;
		return s;
	});
	persist();
}

/**
 * --- HELPERS ---
 */
function makeApplicant(day: number): Applicant {
	const roles: EmployeeRole[] = ['design', 'development', 'marketing', 'support'];

	// pick primary skill
	const primaryRole = roles[Math.floor(Math.random() * roles.length)];

	// sometimes add a secondary skill
	const hasSecondary = Math.random() < 0.35;
	const secondaryRole = hasSecondary
		? roles.filter((r) => r !== primaryRole)[Math.floor(Math.random() * (roles.length - 1))]
		: null;

	// level roll (unchanged)
	const roll = Math.random();
	const level = roll < 0.7 ? 1 : roll < 0.92 ? 2 : 3;

	// proficiency bands by level
	const primaryProficiency =
		level === 1 ? rand(55, 75) : level === 2 ? rand(70, 90) : rand(85, 100);

	const secondaryProficiency = secondaryRole ? rand(30, primaryProficiency - 15) : null;

	const skills = [
		{ role: primaryRole, proficiency: primaryProficiency },
		...(secondaryRole ? [{ role: secondaryRole, proficiency: secondaryProficiency! }] : [])
	];

	// base salary driven by PRIMARY skill
	const baseSalary =
		primaryRole === 'development'
			? 30
			: primaryRole === 'design'
				? 26
				: primaryRole === 'marketing'
					? 28
					: 22;

	const salaryPerDay = Math.round(baseSalary + level * 6 + Math.random() * 6);
	const signingBonus = Math.round(150 + level * 120 + Math.random() * 120);

	return {
		id: uid('app'),
		name: randomName(),
		skills,
		level,
		salaryPerDay,
		signingBonus
	};
}

function randomName() {
	const first = [
		'Sam',
		'Jordan',
		'Taylor',
		'Avery',
		'Riley',
		'Casey',
		'Drew',
		'Alex',
		'Morgan',
		'Cameron'
	];
	const last = [
		'Park',
		'Reed',
		'Nguyen',
		'Patel',
		'Kim',
		'Garcia',
		'Baker',
		'Lopez',
		'Singh',
		'Johnson'
	];
	return `${pick(first)} ${pick(last)}`;
}

function pick<T>(arr: T[]) {
	return arr[Math.floor(Math.random() * arr.length)];
}

function rand(min: number, max: number) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function clamp(n: number, min: number, max: number) {
	return Math.max(min, Math.min(max, n));
}
