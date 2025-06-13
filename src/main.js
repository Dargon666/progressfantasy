import { gameTick, tickCount } from "./core/gameLoop.js";
import { jobs } from "./data/jobs.js";
import { player, loadGame, saveGame, getXPNeeded } from "./core/player.js";
import { items } from "./data/items.js";


console.log("Main.js loaded");
window.manualSave = saveGame;
const smoothedXP = {}; // job.id → float

loadGame(jobs);


const tabJobs = document.getElementById("tab-jobs");
const tabStats = document.getElementById("tab-stats");
const tabSettings = document.getElementById("tab-settings");
const tabItems = document.getElementById("tab-items");


function switchTab(tabName) {
  document.querySelectorAll(".tab").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.tab === tabName);
  });

  document.querySelectorAll(".tab-pane").forEach(pane => {
    pane.classList.toggle("active", pane.id === `tab-${tabName}`);
  });

  // Optional: rerender items or jobs if switching
  if (tabName === "jobs") renderJobs();
  if (tabName === "items") renderItems();
}


function renderJobs() {
  tabJobs.innerHTML = "";

  jobs.forEach(job => {
    const jobLevel = player.levels[job.id] || 0;
    const isUnlocked =
      job.unlockLevel === 0 ||
      jobLevel > 0 ||
      Object.values(player.levels).some(level => level >= job.unlockLevel);
    if (!isUnlocked) return;

    const jobRow = document.createElement("div");
    jobRow.className = "job-row";

    const xp = player.xp[job.id] || 0;
    const xpNeeded = getXPNeeded(jobLevel);
    const progressPercent = Math.min((xp / xpNeeded) * 100, 100);

    // XP Bar with job name
    const xpBar = document.createElement("div");
    xpBar.className = "xp-bar";
    xpBar.id = `bar-${job.id}`;
    xpBar.onclick = () => {
      player.activeJob = job.id;
    };
    xpBar.innerHTML = `
      <div class="xp-fill" id="fill-${job.id}" style="width: ${progressPercent}%"></div>
      <div class="job-name" id="name-${job.id}">${job.name}</div>
    `;
    if (player.activeJob === job.id) {
      xpBar.classList.add("active");
    }

    // Right-side info: XP and gold
    const info = document.createElement("div");
    info.className = "job-info";
    info.innerHTML = `
      <div class="xp-amount" id="text-${job.id}">
        ${xp.toFixed(1)} / ${xpNeeded} XP — Lvl ${jobLevel}
      </div>
      <div class="gold-rate">
        Gold/sec: ${job.income.toFixed(1)}
      </div>
    `;

    jobRow.appendChild(xpBar);
    jobRow.appendChild(info);
    tabJobs.appendChild(jobRow);
  });
}


function renderStats() {
  const statsDiv = document.getElementById("stats-output");

  let income = 0;
  let drain = 0;

  // Get gold income from active job
  if (player.activeJob) {
    const job = jobs.find(j => j.id === player.activeJob);
    if (job) income = job.income;
  }

  // Get total item drain
  items.forEach(item => {
    if (player.items[item.id]) {
      drain += item.costPerTick;
    }
  });

  const net = income - drain;

  statsDiv.textContent = `
Gold: ${player.gold.toFixed(1)}
Income: ${income.toFixed(2)} / tick
Drain: ${drain.toFixed(2)} / tick
Net: ${net.toFixed(2)} / tick
Active Job: ${player.activeJob || "None"}
Total Levels: ${Object.values(player.levels).reduce((a, b) => a + b, 0)}
  `;
}


function updateXPBars() {
  jobs.forEach(job => {
    const id = job.id;
    if (!(id in player.levels)) return;

    const level = player.levels[id];
    const actualXP = player.xp[id] || 0;
    const xpNeeded = getXPNeeded(level);

    // Initialize smoothing
    if (!(id in smoothedXP)) smoothedXP[id] = actualXP;

    // Move toward real XP (lerp)
    const smoothingFactor = 1; // lower = smoother
    smoothedXP[id] += (actualXP - smoothedXP[id]) * smoothingFactor;

    const percent = Math.min((smoothedXP[id] / xpNeeded) * 100, 100);

    const fill = document.getElementById(`fill-${id}`);
    const text = document.getElementById(`text-${id}`);

    if (fill) fill.style.width = `${percent}%`;
    if (text) text.textContent = `${actualXP.toFixed(1)} / ${xpNeeded} XP — Lvl ${level}`;
  });
}

function renderItems() {
  tabItems.innerHTML = "";

  items.forEach(item => {
    const row = document.createElement("div");
    row.className = "item-row";

    // Item name + cost
    const label = document.createElement("span");
    label.textContent = `${item.name} - ${item.costPerTick.toFixed(2)} gold/tick`;
    label.style.marginRight = "10px";

    // Toggle button
    const toggle = document.createElement("button");
    toggle.textContent = player.items[item.id] ? "Disable" : "Enable";
    toggle.onclick = () => {
      player.items[item.id] = !player.items[item.id];
      renderItems(); // rerender after toggle
    };

    row.appendChild(label);
    row.appendChild(toggle);
    tabItems.appendChild(row);
  });
}






renderJobs();

setInterval(() => {
  gameTick();
  updateXPBars(); // ✅ run every tick

  if (tickCount % 3 === 0) {
    renderJobs();  // ✅ less frequent redraw
    renderStats();
  }
}, 100);

setInterval(() => {
  saveGame();
  console.log("Game saved.");
}, 5000); // every 5 seconds

document.querySelectorAll(".tab").forEach(button => {
  button.addEventListener("click", () => {
    switchTab(button.dataset.tab);
  });
});