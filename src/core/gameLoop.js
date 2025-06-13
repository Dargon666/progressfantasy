import { jobs } from "../data/jobs.js";
import { player, checkJobLevelUp } from "./player.js";

let tickCount = 0;

export function gameTick() {
  tickCount++;

  // Update stats UI
  const statsDiv = document.getElementById("stats");

  if (player.activeJob) {
  const job = jobs.find(j => j.id === player.activeJob);
  if (job) {
    player.gold += job.income / 10;
    player.xp[job.id] += job.baseXP / 10;
    checkJobLevelUp(job.id);
  }
}

  if (statsDiv) {
    statsDiv.textContent = `
      Tick: ${tickCount}
      | Gold: ${player.gold.toFixed(1)}
      | Active Job: ${player.activeJob || "None"}
    `;
  }
}