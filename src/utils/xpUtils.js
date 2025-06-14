import { player } from "../core/player.js";
import { items } from "../data/items.js";
import { jobs } from "../data/jobs.js";
import { skills } from "../data/skills.js";

export function getStatMultiplier(boostMap) {
  let multiplier = 1;

  for (const stat in boostMap) {
    const statValue = player.stats[stat] || 0;
    const statEffect = boostMap[stat] || 0;

    multiplier *= 1 + statValue * statEffect;
  }

  return multiplier;
}

export function calculateMultipliers() {
  let jobMultiplier = 1;
  let skillMultiplier = 1;

  const activeJob = player.activeJob;
  const activeSkill = player.activeSkill;

  const jobObj = jobs.find(j => j.id === activeJob);
  const skillObj = skills.find(s => s.id === activeSkill);

  items.forEach(item => {
    if (!player.items[item.id] || !item.xpBoost) return;

    const boost = item.xpBoost;

    // 🛡️ Job multiplier (safe check)
    if (
      boost.jobs?.includes(activeJob) ||
      (jobObj?.category && boost.jobCategories?.includes(jobObj.category))
    ) {
      jobMultiplier *= boost.jobMultiplier || 1;
    }

    // 🛡️ Skill multiplier (safe check)
    if (
      boost.skills?.includes(activeSkill) ||
      (skillObj?.category && boost.skillCategories?.includes(skillObj.category))
    ) {
      skillMultiplier *= boost.skillMultiplier || 1;
    }
  });

  // 📈 Stat-based job multiplier boost from skill (if active skill grants it)
  if (
    skillObj?.xpBoost?.jobMultiplierPerLevel &&
    Array.isArray(skillObj?.xpBoost?.jobCategories)
  ) {
    const matchingJobs = jobs.filter(
      j => j.category && skillObj.xpBoost.jobCategories.includes(j.category)
    );
    matchingJobs.forEach(job => {
      const level = player.levels?.[job.id] || 0;
      jobMultiplier *= 1 + (skillObj.xpBoost.jobMultiplierPerLevel * level);
    });
  }

  // 🧠 Stat-based skill multiplier boost
  if (skillObj?.xpBoostFromStats) {
    for (const stat in skillObj.xpBoostFromStats) {
      const statValue = player.stats?.[stat] || 0;
      const multiplier = skillObj.xpBoostFromStats[stat];
      skillMultiplier *= 1 + (statValue * multiplier);
    }
  }

  return { jobMultiplier, skillMultiplier };
}

export function getXPNeeded(level, base) {
  const growth = 1.1;     // Scaling factor per level

  return Math.floor(base * Math.pow(growth, level));
}
