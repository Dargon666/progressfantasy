import { jobs } from "../data/jobs.js";
import { items } from "../data/items.js";
import { player, checkJobLevelUp } from "./player.js";

let tickCount = 0;
export { tickCount };

export function gameTick() {
  tickCount++;

  const statsDiv = document.getElementById("stats");

  let totalDrain = 0;

  if (player.activeJob) {
    const job = jobs.find(j => j.id === player.activeJob);
    if (job) {
      let xpGain = job.baseXP / 10;

      // Apply item-based XP multipliers
      items.forEach(item => {
        const level = player.items[item.id] || 0;
        if (level > 0 && item.targets.includes(job.id)) {
          xpGain *= Math.pow(item.multiplier, level);
          totalDrain += item.costPerTick * level;
        }
      });

      // Apply gold drain and XP gain
      player.gold -= totalDrain;
      player.gold = Math.max(player.gold, 0); // Prevent negative gold
      player.gold += job.income / 10;
      player.xp[job.id] += xpGain;
      checkJobLevelUp(job.id);
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
