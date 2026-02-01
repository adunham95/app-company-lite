export type Phase = 'design' | 'development' | 'marketing' | 'support';
export type EmployeeRole = Phase;

export type SoftwareType =
	| 'game'
	| 'browser'
	| 'photo_editor'
	| 'ide'
	| 'office'
	| 'video_editor'
	| 'ai_assistant'
	| 'music_studio'
	| 'security';

export interface FeatureDef {
	id: string;
	type: SoftwareType;
	name: string;
	description?: string;

	designCost: number;
	devCost: number;

	featureValue: number; // helps acquisition
	qualityValue: number; // helps rating/retention
}

export interface BaseRequirementDef {
	id: string;
	type: SoftwareType;
	name: string;
	description?: string;

	designCost: number;
	devCost: number;

	qualityValue: number;
}

export interface ProductRequirement {
	id: string; // instance id (unique per product)
	defId: string; // catalog id
	kind: 'base' | 'feature';

	name: string;
	description?: string;

	// totals (for progress UI)
	designTotal: number;
	devTotal: number;

	// remaining (work down to 0)
	designRemaining: number;
	devRemaining: number;

	completed: boolean;
	completedAtDay: number | null;

	// impacts (copied from catalog for easy recompute)
	featureValue: number;
	qualityValue: number;
}

export interface Employee {
	id: string;
	name: string;
	skills: {
		role: EmployeeRole;
		proficiency: number; // 1–100 or 1–5
	}[];
	level: number;
	salaryPerDay: number;
	hiredAtDay: number;
}

export interface Applicant {
	id: string;
	name: string;
	skills: {
		role: EmployeeRole;
		proficiency: number; // 1–100 or 1–5
	}[];
	level: number;
	salaryPerDay: number;
	signingBonus: number;
}

export interface Competitor {
	id: string;
	name: string;
	type: SoftwareType;
	users: number;
	rating: number; // 1..5
	marketingPressure: number;
	pricePerUserPerDay: number;
}

export interface Market {
	type: SoftwareType;
	size: number; // total potential users
	competitors: Competitor[];
}

export type Rating = 1 | 2 | 3 | 4 | 5;

export interface SoftwareProduct {
	id: string;
	type: SoftwareType;
	name: string;
	description: string;
	released: boolean;
	releasedAtDay: number | null;
	users: number;
	// derived stats (recomputed daily)
	quality: number;
	featureScore: number;

	isSubscription: boolean;

	// ongoing ops knobs
	marketingPressure: number; // marketing increases this; decays slowly
	supportLevel: number; // support increases this; decays very slowly

	dailyPrice?: number;
	oneTimePrice?: number;

	requirements: ProductRequirement[];

	// Accumulated quality signals during dev (cheap to update)
	qualityPoints: number; // + when features completed, good hires, etc.
	bugs: number; // - from rushed work, low skill, etc.

	// Locked at release
	rating: number | null; // set once at release
	popularity: number;
}

export interface Company {
	day: number;
	cash: number;
	revenueToday: number;
	expensesToday: number;

	companyName: string;
	playerName: string;
	companyColor: string;

	employees: Employee[];
	applicants: Applicant[];

	products: SoftwareProduct[];

	markets: Market[];
}

export interface GameState {
	version: 1;
	initialized: boolean;
	company: Company;
}
