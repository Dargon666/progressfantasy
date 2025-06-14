export const jobs = [
  {
    id: "farmer",
    name: "Farmer",
    category: "basic",
    description: "A basic job where you farm crops and gather resources.",
    baseXP: 20,
    income: 0.05,
    costPerTick: 0.0,
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
    baseXP: 30,
    income: 0.1,
    costPerTick: 0.0,
    xpBoostFromStats: {
    strength: 10.22,       // +2% XP per point of strength
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
    baseXP: 40,
    income: 0.2,
    costPerTick: 0.0,
    xpBoostFromStats: {
    strength: 0.02,       // +2% XP per point of strength
    dexterity: 0.01       // +1% XP per point of dexterity
    },
    statGain: { strength: 0.5 }, // ⬅️ every level gives +0.5 strength
      unlock: [
    { jobId: "miner", level: 10 },
    { jobId: "farmer", level: 10 } // Requires miner level 10
  ],
  },
  {
    id: "mage",
    name: "Mage",
    category: "Magic",
    description: "A basic job where you mine ores and materials.",
    baseXP: 50,
    income: 0.2,
    costPerTick: 0.0,
    xpBoostFromStats: {
    wisdom: 0.01,
    intelligence: 0.03 
    },
    statGain: { intelligence: 0.1 }, // ⬅️ every level gives +0.5 strength
    unlock: { jobId: "miner", level: 10 }  // Requires farmer level 5
  }
];