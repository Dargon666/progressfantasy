export const jobs = [
//   {
//     id: "farmer",
//     name: "Farmer",
//     category: "basic",
//     description: "A basic job where you farm crops and gather resources.",
//     baseXP: 20,
//     income: 0.05,
//     costPerTick: 0.0,
//     xpBoostFromStats: {
//     strength: 0.02,       // +2% XP per point of strength
//     dexterity: 0.01       // +1% XP per point of dexterity
//     },
//     unlockLevel: 0,
//     statGain: { strength: 0.5 } // ⬅️ every level gives +0.5 strength
//   },
//   {
//     id: "betterfarmer",
//     name: "Better Farmer",
//     category: "basic",
//     description: "A basic job where you farm crops and gather resources.",
//     baseXP: 40,
//     income: 0.1,
//     costPerTick: 0.0,
//     xpBoostFromStats: {
//     strength: 0.03,       // +2% XP per point of strength
//     dexterity: 0.015       // +1% XP per point of dexterity
//     },
//     unlockLevel: 0,
//     statGain: { strength: 0.5 } // ⬅️ every level gives +0.5 strength
//   },
//   {
//     id: "miner",
//     name: "Miner",
//     category: "basic",
//     description: "A basic job where you mine ores and materials.",
//     baseXP: 30,
//     income: 0.1,
//     costPerTick: 0.0,
//     xpBoostFromStats: {
//     strength: 10.22,       // +2% XP per point of strength
//     dexterity: 0.01       // +1% XP per point of dexterity
//     },
//     unlock: { type: "job", jobId: "farmer", level: 5 },  // Requires farmer level 5
//     statGain: { strength: 0.5 } // ⬅️ every level gives +0.5 strength
//   },
//   {
//     id: "blacksmith",
//     name: "blacksmith",
//     category: "basic",
//     description: "A basic job where you mine ores and materials.",
//     baseXP: 40,
//     income: 0.2,
//     costPerTick: 0.0,
//     xpBoostFromStats: {
//     strength: 0.02,       // +2% XP per point of strength
//     dexterity: 0.01       // +1% XP per point of dexterity
//     },
//     statGain: { strength: 0.5 }, // ⬅️ every level gives +0.5 strength
//       unlock: [
//     { type: "job", jobId: "miner", level: 10 },
//     { type: "job", jobId: "farmer", level: 10 } // Requires miner level 10
//   ],
//   },
//   {
//     id: "mage",
//     name: "Mage",
//     category: "Magic",
//     description: "A basic job where you mine ores and materials.",
//     baseXP: 50,
//     income: 0.2,
//     costPerTick: 0.0,
//     xpBoostFromStats: {
//     wisdom: 0.01,
//     intelligence: 0.03 
//     },
//     statGain: { intelligence: 0.1 }, // ⬅️ every level gives +0.5 strength
//     unlock: { type: "job", jobId: "miner", level: 10 }  // Requires farmer level 5
//   }
 {
     id: "beggar",
     name: "Beggar",
     category: "basic",
     description: "get money from people on the street.",
     baseXP: 20,
     income: 0.01,
     costPerTick: 0.0,
     xpBoostFromStats: {
     charisma: 0.02,       // +2% XP per point of strength
     dexterity: 0.01       // +1% XP per point of dexterity
     },
     unlockLevel: 0,
     statGain: { charisma: 0.01 }
    },
    {
     id: "shoe shiner",
     name: "Shoe Shiner",
     category: "basic",
     description: "Shine shoes for money.",
     baseXP: 22,
     income: 0.02,
     costPerTick: 0.0,
     xpBoostFromStats: {
     charisma: 0.01,       // +2% XP per point of strength
     dexterity: 0.02       // +1% XP per point of dexterity
     },
      unlock: [
     { type: "job", jobId: "beggar", level: 5 } // Requires miner level 10
  ],
     statGain: { dexterity: 0.01 }
    },
    {
     id: "courier",
     name: "Courier",
     category: "basic",
     description: "Deliver messages and packages around the city.",
     baseXP: 22,
     income: 0.02,
     costPerTick: 0.0,
     xpBoostFromStats: {
     agility: 0.02,       // +2% XP per point of strength
     strength: 0.01       // +1% XP per point of dexterity
     },
      unlock: [
     { type: "job", jobId: "beggar", level: 5 } // Requires miner level 10
  ],
     statGain: { agility: 0.01 }
    },
    {
     id: "pickpocket",
     name: "Pickpocket",
     category: "basic",
     description: "Steal money from unsuspecting victims.",
     baseXP: 22,
     income: 0.02,
     costPerTick: 0.0,
     xpBoostFromStats: {
     agility: 0.01,       // +2% XP per point of strength
     dexterity: 0.02       // +1% XP per point of dexterity
     },
      unlock: [
     { type: "job", jobId: "beggar", level: 5 } // Requires miner level 10
  ],
     statGain: { dexterity: 0.01 }
    },
    {
     id: "street scribe",
     name: "Street Scribe",
     category: "basic",
     description: "Write letters and documents for people who can't write.",
     baseXP: 22,
     income: 0.02,
     costPerTick: 0.0,
     xpBoostFromStats: {
     wisdom: 0.01,       // +2% XP per point of strength
     intelligence: 0.02       // +1% XP per point of dexterity
     },
      unlock: [
     { type: "job", jobId: "beggar", level: 5 } // Requires miner level 10
  ],
     statGain: { intelligence: 0.01 }
    },
    {
     id: "peddler",
     name: "Peddler",
     category: "basic",
     description: "Sell small items and trinkets on the street.",
     baseXP: 22,
     income: 0.02,
     costPerTick: 0.0,
     xpBoostFromStats: {
     charisma: 0.02,       // +2% XP per point of strength
     intelligence: 0.01       // +1% XP per point of dexterity
     },
      unlock: [
     { type: "job", jobId: "beggar", level: 5 } // Requires miner level 10
  ],
     statGain: { charisma: 0.01 }
    },
    {
     id: "angry drunk",
     name: "Angry Drunk",
     category: "basic",
     description: "Fight and defend yourself against street thugs.",
     baseXP: 22,
     income: 0.01,
     costPerTick: 0.0,
     xpBoostFromStats: {
     strength: 0.02,       
     agility: 0.01       
     },
      unlock: [
     { type: "job", jobId: "beggar", level: 5 } // Requires miner level 10
  ],
     statGain: { strength: 0.02 }
    },
    {
     id: "street preacher",
     name: "Street Preacher",
     category: "basic",
     description: "GLORY TO STEVE! Destroyer of worlds, creator of all things.",
     baseXP: 22,
     income: 0.02,
     costPerTick: 0.0,
     xpBoostFromStats: {
     wisdom: 0.02,       // +2% XP per point of strength
     charisma: 0.01       // +1% XP per point of dexterity
     },
      unlock: [
     { type: "job", jobId: "beggar", level: 5 } // Requires miner level 10
  ],
     statGain: {wisdom: 0.01 }
    },
    {
     id: "novice cobbler",
     name: "Novice Cobbler",
     category: "crafting",
     description: "Craft shoes and sandals for the poor.",
     baseXP: 32,
     income: 0.05,
     costPerTick: 0.0,
     xpBoostFromStats: {
     dexterity: 0.04,       // +2% XP per point of strength
     wisdom: 0.01       // +1% XP per point of dexterity
     },
      unlock: [
     { type: "job", jobId: "shoe shiner", level: 10 } // Requires miner level 10
  ],
     statGain: {dexterity: 0.05 }
    },
    {
    id: "novice blacksmith",
     name: "Novice Blacksmith",
     category: "crafting",
     description: "Forge weapons and armor for the city.",
     baseXP: 40,
     income: 0.1,
     costPerTick: 0.0,
     xpBoostFromStats: {
     dexterity: 0.04,       // +2% XP per point of strength
     strength: 0.02       // +1% XP per point of dexterity
     },
      unlock: [
     { type: "job", jobId: "novice cobbler", level: 10 }, // Requires miner level 10
     { type: "skill", skillId: "endurance", level: 10 } 
  ],
     statGain: {dexterity: 0.05 }
    },
    {
    id: "burgler",
     name: "Burgler",
     category: "roguery",
     description: "Steal from the rich and give to yourself.",
     baseXP: 33,
     income: 0.3,
     costPerTick: 0.0,
     xpBoostFromStats: {
     agility: 0.03,       // +2% XP per point of strength
     dexterity: 0.02       // +1% XP per point of dexterity
     },
      unlock: [
     { type: "job", jobId: "pickpocket", level: 10 },
     { type: "skill", skillId: "streetwise", level: 10 } 
  ],
     statGain: {agility: 0.03 }
    },
    {
    id: "street hustler",
     name: "Street Hustler",
     category: "roguery",
     description: "Con your way into money and resources.",
     baseXP: 33,
     income: 0.3,
     costPerTick: 0.0,
     xpBoostFromStats: {
     agility: 0.02,       // +2% XP per point of strength
     dexterity: 0.03       // +1% XP per point of dexterity
     },
      unlock: [
     { type: "job", jobId: "pickpocket", level: 10 },
     { type: "skill", skillId: "sleight_of_hand", level: 10 } 
  ],
     statGain: {agility: 0.03 }
    },
        {
     id: "cleaner",
     name: "Cleaner",
     category: "roguery",
     description: "Con your way into money and resources.",
     baseXP: 70,
     income: 0.5,
     costPerTick: 0.0,
     xpBoostFromStats: {
     charisma: 0.05,       
     dexterity: 0.03       
     },
      unlock: [
     { type: "job", jobId: "burgler", level: 10 },
     { type: "job", jobId: "peddler", level: 20 },
     { type: "skill", skillId: "bartering", level: 20 }
  ],
     statGain: {charisma: 0.05 }
    },
];