import { gameTick } from "./core/gameLoop.js";
import { jobs } from "./data/jobs.js";
import { player, initPlayer } from "./core/player.js";

console.log("Main.js loaded");

initPlayer(jobs);

const gameDiv = document.getElementById("game");

function renderJobs() {
  gameDiv.innerHTML = "";

  jobs.forEach(job => {
    const jobLevel = player.levels[job.id] || 0;

    const isUnlocked =
      job.unlockLevel === 0 ||
      jobLevel > 0 ||
      Object.values(player.levels).some(level => level >= job.unlockLevel);

    if (isUnlocked) {
      const btn = document.createElement("button");
      btn.textContent = `${job.name} (Lvl ${jobLevel})`;

      btn.onclick = () => {
        player.activeJob = job.id;
        renderJobs(); // re-render immediately to reflect selected state
      };

      if (player.activeJob === job.id) {
        btn.classList.add("active");
      }

      gameDiv.appendChild(btn);
    }
  });
}

renderJobs();

setInterval(() => {
  gameTick();
  renderJobs(); // keeps buttons updated, unlocks shown
}, 100);
