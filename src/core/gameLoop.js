import { jobs } from "../data/jobs.js";
import { items } from "../data/items.js";
import { player, checkJobLevelUp, checkSkillLevelUp} from "./player.js";
import { skills } from "../data/skills.js";
import { calculateMultipliers, getXPNeeded } from "../utils/xpUtils.js";
import { formatGold } from "../utils/format.js";
import { getStatMultiplier } from "../utils/xpUtils.js";

let tickCount = 0;
export { tickCount };

export function gameTick() {
  tickCount++;

  const statsDiv = document.getElementById("stats");
  let totalDrain = 0;



  // XP multipliers from utility
  let { jobMultiplier: jobXpMultiplier, skillMultiplier: skillXpMultiplier } = calculateMultipliers();

  // Only calculate gold drain here
  items.forEach(item => {
    if (player.items[item.id]) {
      totalDrain += item.costPerTick;
    }
  });

  // Active skill XP
 if (player.activeSkill) {
  const skill = skills.find(s => s.id === player.activeSkill);

  if (skill) {
    const id = skill.id;
    const statMultiplier = getStatMultiplier(skill.xpBoostFromStats || {});
    const gain = player.baseXP * statMultiplier;

    player.skillXP[id] += gain;
    checkSkillLevelUp(id);
  } else {
    console.warn(`⚠️ No skill found for ID "${player.activeSkill}"`);
  }
}


  // Active job income and XP
  if (player.activeJob) {
    const job = jobs.find(j => j.id === player.activeJob);
    if (job) {
      const level = player.levels[job.id] || 1;
      player.gold += job.income * level;
      player.xp[job.id] += player.baseXP * jobXpMultiplier;
      checkJobLevelUp(job.id);
    }
  }

  // Apply drain
  player.gold -= totalDrain;
  if (player.gold < 0) player.gold = 0;

  // Stats UI
  if (statsDiv) {
    statsDiv.textContent = `
      Tick: ${tickCount}
      | Gold: ${formatGold(player.gold)}
      | Net Gold/tick: ${formatGold(player.gold - totalDrain)}
      | Active Job: ${player.activeJob || "None"}
    `;
  }

    if (player.activeSkill) {
  const skill = skills.find(s => s.id === player.activeSkill);
  if (skill) {
    const id = skill.id;

    const statMultiplier = getStatMultiplier(skill.xpBoostFromStats || {});
    const gain = player.baseXP * skillXpMultiplier;

    checkSkillLevelUp(id);
  }
}

}

