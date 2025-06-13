import { jobs } from "../data/jobs.js";
import { items } from "../data/items.js";
import { player, checkJobLevelUp } from "./player.js";
import { skills } from "../data/skills.js";

let tickCount = 0;
export { tickCount };

export function gameTick() {
  tickCount++;

  const statsDiv = document.getElementById("stats");

  // Inside gameTick()
let totalDrain = 0;
let xpMultiplier = 1;

items.forEach(item => {
  if (player.items[item.id]) {
    totalDrain += item.costPerTick;

    if (item.targets.includes(player.activeJob)) {
      xpMultiplier *= item.multiplier;
    }
  }
});

player.gold -= totalDrain;
if (player.gold < 0) player.gold = 0; // prevent negative gold

if (player.activeJob) {
  const job = jobs.find(j => j.id === player.activeJob);
  if (job) {
    const level = player.levels[job.id] || 1;

    player.gold += job.income * level;
    player.xp[job.id] += job.baseXP * level;
    checkJobLevelUp(job.id);

    // Example: Strength and Endurance gain XP from any job
    player.skillXP["strength"] += 0.2;
    player.skillXP["endurance"] += 0.1;

    checkSkillLevelUp("strength");
    checkSkillLevelUp("endurance");
  }
}


  // Optional debug/visual stats display
  if (statsDiv) {
    statsDiv.textContent = `
      Tick: ${tickCount}
      | Gold: ${player.gold.toFixed(1)}
      | Active Job: ${player.activeJob || "None"}
    `;
  }
}
