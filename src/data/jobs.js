export const jobs = [
  {
    id: "farmer",
    name: "Farmer",
    category: "basic",
    description: "A basic job where you farm crops and gather resources.",
    baseXP: 100,
    income: 0.05,
    xpBoostFromStats: {
    strength: 0.02,       // +2% XP per point of strength
    dexterity: 0.01       // +1% XP per point of dexterity
    },
    unlockLevel: 0,
    statGain: { strength: 0.5 } // ⬅️ every level gives +0.5 strength
  },
  {
    id: "miner",
    name: "Miner",
    category: "basic",
    description: "A basic job where you mine ores and materials.",
    baseXP: 150,
    income: 0.1,
    xpBoostFromStats: {
    strength: 0.02,       // +2% XP per point of strength
    dexterity: 0.01       // +1% XP per point of dexterity
    },
    unlock: { jobId: "farmer", level: 5 },  // Requires farmer level 5
    statGain: { strength: 0.5 } // ⬅️ every level gives +0.5 strength
  },
  {
    id: "blacksmith",
    name: "blacksmith",
    category: "basic",
    description: "A basic job where you mine ores and materials.",
    baseXP: 160,
    income: 0.2,
    xpBoostFromStats: {
    strength: 0.02,       // +2% XP per point of strength
    dexterity: 0.01       // +1% XP per point of dexterity
    },
    statGain: { strength: 0.5 }, // ⬅️ every level gives +0.5 strength
    unlock: { jobId: "miner", level: 10 }  // Requires farmer level 5
  },
  {
    id: "mage",
    name: "Mage",
    category: "Magic",
    description: "A basic job where you mine ores and materials.",
    baseXP: 160,
    income: 0.2,
    xpBoostFromStats: {
    wisdom: 0.01,
    intelligence: 0.03 
    },
    statGain: { intelligence: 0.1 }, // ⬅️ every level gives +0.5 strength
    unlock: { jobId: "miner", level: 10 }  // Requires farmer level 5
  }
];