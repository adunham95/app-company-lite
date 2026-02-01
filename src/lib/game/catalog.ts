import type { BaseRequirementDef, FeatureDef, SoftwareType } from './gameTypes';

export const SOFTWARE_TYPES: { id: SoftwareType; name: string; blurb: string }[] = [
	{ id: 'game', name: 'Game', blurb: 'Content + polish drive success.' },
	{ id: 'browser', name: 'Browser', blurb: 'Speed, security, extensions.' },
	{ id: 'photo_editor', name: 'Photo Editor', blurb: 'Tools, layers, export workflows.' },
	{ id: 'ide', name: 'IDE', blurb: 'Productivity, plugins, debugging.' },
	{ id: 'office', name: 'Office Suite', blurb: 'Documents, spreadsheets, collaboration.' },
	{ id: 'video_editor', name: 'Video Editor', blurb: 'Timeline, effects, rendering.' },
	{ id: 'ai_assistant', name: 'AI Assistant', blurb: 'Automation, intelligence, scale.' },
	{ id: 'music_studio', name: 'Music Studio', blurb: 'Audio creation and mixing.' },
	{ id: 'security', name: 'Security Software', blurb: 'Protection, trust, compliance.' }
];

// Base requirements (each type has its own core)
export const BASE_REQUIREMENTS: BaseRequirementDef[] = [
	{
		id: 'base_game_core',
		type: 'game',
		name: 'Core Loop + UI',
		description: 'Menus, settings, core gameplay loop.',
		designCost: 70,
		devCost: 140,
		qualityValue: 4
	},
	{
		id: 'base_browser_core',
		type: 'browser',
		name: 'Tabs + Address Bar',
		description: 'Navigation, tabs, basic UI shell.',
		designCost: 70,
		devCost: 160,
		qualityValue: 4
	},
	{
		id: 'base_photo_core',
		type: 'photo_editor',
		name: 'Canvas + Tool UI',
		description: 'Panels, canvas, tool switching.',
		designCost: 85,
		devCost: 170,
		qualityValue: 5
	},
	{
		id: 'base_ide_core',
		type: 'ide',
		name: 'Editor + File Tree',
		description: 'Editor layout, tabs, file explorer.',
		designCost: 70,
		devCost: 190,
		qualityValue: 5
	},
	{
		id: 'base_office_core',
		type: 'office',
		name: 'Document + Table Editor',
		description: 'Text editing, tables, basic formatting.',
		designCost: 80,
		devCost: 180,
		qualityValue: 5
	},
	{
		id: 'base_video_core',
		type: 'video_editor',
		name: 'Timeline + Playback',
		description: 'Tracks, playback, trimming.',
		designCost: 90,
		devCost: 220,
		qualityValue: 5
	},
	{
		id: 'base_ai_core',
		type: 'ai_assistant',
		name: 'Inference Engine',
		description: 'Prompting, responses, memory.',
		designCost: 50,
		devCost: 300,
		qualityValue: 6
	},
	{
		id: 'base_music_core',
		type: 'music_studio',
		name: 'Track Editor',
		description: 'Tracks, playback, recording.',
		designCost: 75,
		devCost: 210,
		qualityValue: 5
	},
	{
		id: 'base_security_core',
		type: 'security',
		name: 'Scanning Engine',
		description: 'Threat detection and monitoring.',
		designCost: 60,
		devCost: 200,
		qualityValue: 6
	}
];

export const FEATURES: FeatureDef[] = [
	// GAME
	{
		id: 'g_levels',
		type: 'game',
		name: 'Level System',
		description: 'Progression + unlocks.',
		designCost: 55,
		devCost: 130,
		featureValue: 10,
		qualityValue: 2
	},
	{
		id: 'g_multiplayer',
		type: 'game',
		name: 'Multiplayer',
		description: 'Matchmaking + sessions.',
		designCost: 70,
		devCost: 260,
		featureValue: 18,
		qualityValue: 2
	},
	{
		id: 'g_mods',
		type: 'game',
		name: 'Mod Support',
		description: 'Community content pipeline.',
		designCost: 45,
		devCost: 180,
		featureValue: 12,
		qualityValue: 3
	},
	{
		id: 'g_story',
		type: 'game',
		name: 'Story Campaign',
		description: 'Narrative + missions.',
		designCost: 80,
		devCost: 160,
		featureValue: 16,
		qualityValue: 3
	},

	// BROWSER
	{
		id: 'b_extensions',
		type: 'browser',
		name: 'Extensions',
		description: 'Plugin ecosystem.',
		designCost: 45,
		devCost: 200,
		featureValue: 16,
		qualityValue: 3
	},
	{
		id: 'b_sync',
		type: 'browser',
		name: 'Sync',
		description: 'Bookmarks/password sync.',
		designCost: 35,
		devCost: 150,
		featureValue: 10,
		qualityValue: 3
	},
	{
		id: 'b_privacy',
		type: 'browser',
		name: 'Privacy Tools',
		description: 'Tracking protection.',
		designCost: 40,
		devCost: 140,
		featureValue: 10,
		qualityValue: 6
	},
	{
		id: 'b_reader',
		type: 'browser',
		name: 'Reader Mode',
		description: 'Distraction-free reading.',
		designCost: 25,
		devCost: 90,
		featureValue: 7,
		qualityValue: 2
	},

	// PHOTO EDITOR
	{
		id: 'p_filters',
		type: 'photo_editor',
		name: 'Filters',
		description: 'Presets + adjustments.',
		designCost: 55,
		devCost: 130,
		featureValue: 12,
		qualityValue: 3
	},
	{
		id: 'p_layers',
		type: 'photo_editor',
		name: 'Layers',
		description: 'Non-destructive edits.',
		designCost: 65,
		devCost: 220,
		featureValue: 18,
		qualityValue: 5
	},
	{
		id: 'p_export',
		type: 'photo_editor',
		name: 'Export Presets',
		description: 'Formats + templates.',
		designCost: 30,
		devCost: 95,
		featureValue: 8,
		qualityValue: 2
	},
	{
		id: 'p_brushes',
		type: 'photo_editor',
		name: 'Brush Engine',
		description: 'Custom brushes + smoothing.',
		designCost: 50,
		devCost: 160,
		featureValue: 14,
		qualityValue: 3
	},

	// IDE
	{
		id: 'i_debugger',
		type: 'ide',
		name: 'Debugger',
		description: 'Breakpoints + stepping.',
		designCost: 40,
		devCost: 260,
		featureValue: 20,
		qualityValue: 3
	},
	{
		id: 'i_lsp',
		type: 'ide',
		name: 'Intellisense (LSP)',
		description: 'Autocomplete + go-to-def.',
		designCost: 35,
		devCost: 240,
		featureValue: 18,
		qualityValue: 3
	},
	{
		id: 'i_plugins',
		type: 'ide',
		name: 'Plugin System',
		description: 'Third-party extensions.',
		designCost: 45,
		devCost: 250,
		featureValue: 19,
		qualityValue: 3
	},
	{
		id: 'i_git',
		type: 'ide',
		name: 'Git Integration',
		description: 'Diffs, commits, history.',
		designCost: 30,
		devCost: 150,
		featureValue: 12,
		qualityValue: 2
	},
	{
		id: 'o_collab',
		type: 'office',
		name: 'Real-Time Collaboration',
		description: 'Multi-user editing.',
		designCost: 60,
		devCost: 260,
		featureValue: 18,
		qualityValue: 3
	},
	{
		id: 'o_templates',
		type: 'office',
		name: 'Templates',
		description: 'Pre-built documents.',
		designCost: 35,
		devCost: 90,
		featureValue: 8,
		qualityValue: 2
	},
	{
		id: 'o_comments',
		type: 'office',
		name: 'Comments & Review',
		description: 'Suggestions and feedback.',
		designCost: 30,
		devCost: 120,
		featureValue: 10,
		qualityValue: 2
	},
	{
		id: 'v_effects',
		type: 'video_editor',
		name: 'Effects & Transitions',
		description: 'Visual effects library.',
		designCost: 70,
		devCost: 180,
		featureValue: 14,
		qualityValue: 3
	},
	{
		id: 'v_multitrack',
		type: 'video_editor',
		name: 'Multi-Track Timeline',
		description: 'Layered video & audio.',
		designCost: 55,
		devCost: 200,
		featureValue: 16,
		qualityValue: 3
	},
	{
		id: 'v_render',
		type: 'video_editor',
		name: 'Hardware Rendering',
		description: 'Faster exports.',
		designCost: 30,
		devCost: 160,
		featureValue: 12,
		qualityValue: 4
	},
	{
		id: 'a_codegen',
		type: 'ai_assistant',
		name: 'Code Generation',
		description: 'Generate functions & snippets.',
		designCost: 35,
		devCost: 240,
		featureValue: 22,
		qualityValue: 3
	},
	{
		id: 'a_context',
		type: 'ai_assistant',
		name: 'Long-Term Memory',
		description: 'Remembers past interactions.',
		designCost: 40,
		devCost: 200,
		featureValue: 18,
		qualityValue: 4
	},
	{
		id: 'a_automation',
		type: 'ai_assistant',
		name: 'Task Automation',
		description: 'Runs actions automatically.',
		designCost: 45,
		devCost: 260,
		featureValue: 24,
		qualityValue: 4
	},
	{
		id: 'm_synth',
		type: 'music_studio',
		name: 'Synth Engine',
		description: 'Virtual instruments.',
		designCost: 60,
		devCost: 170,
		featureValue: 14,
		qualityValue: 3
	},
	{
		id: 'm_mixing',
		type: 'music_studio',
		name: 'Mixing & Effects',
		description: 'EQ, compression, reverb.',
		designCost: 55,
		devCost: 160,
		featureValue: 13,
		qualityValue: 3
	},
	{
		id: 's_firewall',
		type: 'security',
		name: 'Firewall',
		description: 'Traffic filtering.',
		designCost: 30,
		devCost: 140,
		featureValue: 10,
		qualityValue: 4
	},
	{
		id: 's_audit',
		type: 'security',
		name: 'Security Audits',
		description: 'Find vulnerabilities.',
		designCost: 45,
		devCost: 180,
		featureValue: 14,
		qualityValue: 5
	}
];

export function featuresForType(type: SoftwareType) {
	return FEATURES.filter((f) => f.type === type);
}

export function baseForType(type: SoftwareType) {
	return BASE_REQUIREMENTS.filter((b) => b.type === type);
}

// Markets
export const MARKET_SIZES: Record<SoftwareType, number> = {
	game: 250_000,
	browser: 500_000,
	photo_editor: 80_000,
	ide: 60_000,
	office: 100_000,
	video_editor: 50_000,
	music_studio: 33_000,
	ai_assistant: 10_000,
	security: 500_000
};

export const COMPETITORS: Record<SoftwareType, { name: string; rating: number; users: number }[]> =
	{
		game: [
			{ name: 'FunForge', rating: 3.8, users: 30_000 },
			{ name: 'ArcadiaWorks', rating: 4.2, users: 55_000 },
			{ name: 'PixelQuest', rating: 4.9, users: 80_000 },
			{ name: 'RetroLoop', rating: 3.4, users: 18_000 }
		],

		browser: [
			{ name: 'SwiftBrowse', rating: 4.1, users: 35_000 },
			{ name: 'Nebula', rating: 3.6, users: 18_000 },
			{ name: 'IronFox', rating: 4.4, users: 120_000 },
			{ name: 'ZenSurf', rating: 3.9, users: 42_000 },
			{ name: 'ClearNet', rating: 4.0, users: 65_000 }
		],

		photo_editor: [
			{ name: 'PixelCraft', rating: 4.0, users: 22_000 },
			{ name: 'SnapStudio', rating: 3.7, users: 15_000 },
			{ name: 'LumaEdit', rating: 4.3, users: 28_000 },
			{ name: 'BrushBox', rating: 3.5, users: 9_000 }
		],

		ide: [
			{ name: 'CodeNest', rating: 4.3, users: 18_000 },
			{ name: 'DevDock', rating: 3.9, users: 12_000 },
			{ name: 'StackForge', rating: 4.6, users: 25_000 },
			{ name: 'ByteStudio', rating: 3.6, users: 7_000 }
		],

		office: [
			{ name: 'DocuFlow', rating: 4.1, users: 40_000 },
			{ name: 'Paperly', rating: 3.8, users: 22_000 },
			{ name: 'WorkSuite', rating: 4.4, users: 55_000 },
			{ name: 'OfficeLite', rating: 3.5, users: 12_000 }
		],

		video_editor: [
			{ name: 'CutScene', rating: 4.2, users: 18_000 },
			{ name: 'FrameForge', rating: 4.5, users: 22_000 },
			{ name: 'QuickClip', rating: 3.6, users: 9_000 },
			{ name: 'RenderBox', rating: 3.9, users: 12_000 }
		],

		music_studio: [
			{ name: 'WaveLab', rating: 4.3, users: 14_000 },
			{ name: 'BeatSmith', rating: 4.0, users: 10_000 },
			{ name: 'TrackPad', rating: 3.7, users: 6_000 }
		],

		ai_assistant: [
			{ name: 'MindSpark', rating: 3.6, users: 6_000 },
			{ name: 'AutoMate', rating: 4.2, users: 3_400 },
			{ name: 'Promptly', rating: 3.8, users: 2_500 },
			{ name: 'Promptly', rating: 1.8, users: 500 }
		],

		security: [
			{ name: 'ShieldCore', rating: 4.5, users: 150_000 },
			{ name: 'SafeNet', rating: 4.1, users: 90_000 },
			{ name: 'Lockwatch', rating: 3.9, users: 60_000 },
			{ name: 'ThreatZero', rating: 3.6, users: 35_000 }
		]
	};
