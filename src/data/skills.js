export const skills = [
  {
  id: "farming",
  name: "Farming",
  category: "sbasic",
  description: "Increases your ability to carry heavy loads and deal physical damage.",
  baseXP: 100,
  xpBoost: {
    jobCategories: ["basic"],     // <-- Corrected to "jobCategories"
    jobMultiplierPerLevel: 0.05   // <-- New: scales with level
  },
    xpBoostFromStats: {
    strength: 0.02,       // +2% XP per point of strength
    dexterity: 0.01       // +1% XP per point of dexterity
    },
    unlock: { jobId: "farmer", level: 5 },  // Requires farmer level 5
    statGain: { strength: 0.5 } // ⬅️ every level gives +0.5 strength
  },
  {
    id: "mining",
    name: "Mining",
    category: "sbasic",
    description: "Increases your ability to carry heavy loads and deal physical damage.",
    baseXP: 100,
    xpBoost: {
    jobCategories: ["basic"],     // <-- Corrected to "jobCategories"
    jobMultiplierPerLevel: 0.05   // <-- New: scales with level
    },
    xpBoostFromStats: {
    strength: 0.02,       // +2% XP per point of strength
    dexterity: 0.01       // +1% XP per point of dexterity
    },
    unlock: { jobId: "farmer", level: 5 },  // Requires farmer level 5
    statGain: { strength: 0.5 } // ⬅️ every level gives +0.5 strength
  }
];
