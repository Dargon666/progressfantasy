import { gameTick, tickCount } from "./core/gameLoop.js";
import { jobs } from "./data/jobs.js";
import { player, loadGame, saveGame, initPlayer} from "./core/player.js";
import { items } from "./data/items.js";
import { skills } from "./data/skills.js";
import { calculateMultipliers, getXPNeeded  } from "./utils/xpUtils.js";
import { formatGold } from "./utils/format.js";
import { getJobById, getSkillById, groupJobsByCategory } from "./utils/dataUtils.js";


console.log("Main.js loaded");
window.manualSave = saveGame;
const smoothedXP = {}; // job.id → float

loadGame(jobs, skills);

const tooltip = document.getElementById("tooltip");

function showTooltip(text, x, y) {
  tooltip.textContent = text;
  tooltip.style.left = `${x + 12}px`;
  tooltip.style.top = `${y + 12}px`;
  tooltip.classList.add("show");
}

function hideTooltip() {
  tooltip.classList.remove("show");
}



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

  const tabList = document.getElementById("item-list");
  tabList.innerHTML = "";

  // Trigger specific renders when needed
  if (tabName === "items") renderItems();
  if (tabName === "skills") renderSkills();
  if (tabName === "jobs") renderJobs();
}



function renderJobs() {
  const tabJobs = document.getElementById("tab-jobs");
  tabJobs.innerHTML = "";

  const groupedJobs = groupJobsByCategory(jobs);

  Object.entries(groupedJobs).forEach(([category, jobList]) => {
    const header = document.createElement("h3");
    header.textContent = category.charAt(0).toUpperCase() + category.slice(1);
    tabJobs.appendChild(header);

    jobList.forEach(job => {
      const jobLevel = player.levels[job.id] || 0;

      const isUnlocked =
        !job.unlock ||
        (player.levels[job.unlock.jobId] || 0) >= job.unlock.level;

      if (isUnlocked) {
        const bar = document.createElement("div");
        bar.className = "xp-bar";
        bar.id = `bar-job-${job.id}`;

        bar.onclick = () => {
          player.activeJob = player.activeJob === job.id ? null : job.id;
        };

        if (player.activeJob === job.id) {
          bar.classList.add("active");
        }

        const level = player.levels[job.id] || 0;
        const xp = player.xp[job.id] || 0;
        const baseXP = job.baseXP || 1;
        const xpNeeded = getXPNeeded(level, baseXP);
        const income = job.income * Math.max(1, level);
        const percent = Math.min((xp / xpNeeded) * 100, 100);

        bar.addEventListener("mouseenter", e => {
          showTooltip(job.description, e.pageX, e.pageY);
        });
        bar.addEventListener("mousemove", e => {
          tooltip.style.left = `${e.pageX + 12}px`;
          tooltip.style.top = `${e.pageY + 12}px`;
        });
        bar.addEventListener("mouseleave", hideTooltip);

        bar.innerHTML = `
          <div class="xp-fill" id="fill-job-${job.id}" style="width: ${percent}%"></div>
          <div class="job-name" id="text-job-${job.id}">
            ${job.name} (Lvl ${level})
          </div>
        `;

        const info = document.createElement("div");
        info.className = "job-info";
        info.innerHTML = `
          +${income.toFixed(2)} Gold/tick<br>
          ${xp.toFixed(1)} / ${xpNeeded} XP
        `;

        tabJobs.appendChild(bar);
        tabJobs.appendChild(info);
      }
    });
  });
}




function renderStats() {
  const statsDiv = document.getElementById("stats-output");
  if (!statsDiv) return;

  const activeJob = player.activeJob;
  const activeSkill = player.activeSkill;
  const { jobMultiplier, skillMultiplier } = calculateMultipliers();

  let jobText = "None";
  let jobGoldPerTick = 0;

  if (activeJob) {
    const job = jobs.find(j => j.id === activeJob);
    const level = player.levels[activeJob] || 1;
    const xpPerTick = 1 * jobMultiplier;
    jobGoldPerTick = job.income * level;

    jobText = `
      ${job.name} (Lvl ${level})<br>
      +${formatGold(jobGoldPerTick)} Gold/tick<br>
      XP/tick: ${xpPerTick.toFixed(2)}
    `;
  }

  let skillText = "None";
  if (activeSkill) {
    const skill = skills.find(s => s.id === activeSkill);
    const level = player.skillLevels[activeSkill] || 1;
    const xpPerTick = 1 * skillMultiplier;

    skillText = `
      ${skill.name} (Lvl ${level})<br>
      XP/tick: ${xpPerTick.toFixed(2)}
    `;
  }

  const netGoldPerTick = (() => {
    let drain = 0;
    items.forEach(item => {
      if (player.items[item.id]) {
        drain += item.costPerTick;
      }
    });
    return jobGoldPerTick - drain;
  })();

  // Add player stats display
  let statsText = "";
  for (const [stat, value] of Object.entries(player.stats)) {
    const label = stat.charAt(0).toUpperCase() + stat.slice(1);
    statsText += `${label}: ${value.toFixed(2)}<br>`;
  }

  statsDiv.innerHTML = `
    Tick: ${tickCount}<br>
    Gold: ${formatGold(player.gold)}<br>
    Net Gold/tick: ${formatGold(netGoldPerTick)}<br><br>
    
    <strong>Job:</strong><br>${jobText}<br><br>
    <strong>Skill:</strong><br>${skillText}<br><br>
    <strong>Stats:</strong><br>${statsText}
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

//renders items 
function renderItems() {
  const itemList = document.getElementById("item-list");
  if (!itemList) {
    console.error("⚠️ Could not find #item-list in the DOM.");
    return;
  }

  itemList.innerHTML = ""; // Clear only the item list container

  items.forEach(item => {
    const card = document.createElement("div");
    card.className = "item-card";

    const isEnabled = !!player.items[item.id];

    const toggle = document.createElement("input");
    toggle.type = "checkbox";
    toggle.checked = isEnabled;
    toggle.className = "item-toggle";
    toggle.disabled = true;

    const content = document.createElement("div");
    content.className = "item-content";
    content.innerHTML = `
      <div class="item-title">${item.name}</div>
      <div class="item-cost">${formatGold(item.costPerTick)} gold/tick</div>
    `;

    // Tooltip
    card.onmouseenter = e =>
      showTooltip(item.description || "No description.", e.pageX, e.pageY);
    card.onmousemove = e => {
      tooltip.style.left = `${e.pageX + 12}px`;
      tooltip.style.top = `${e.pageY + 12}px`;
    };
    card.onmouseleave = hideTooltip;

    // Clicking toggles the item
    card.onclick = () => {
      const currentlyOn = !!player.items[item.id];
      player.items[item.id] = currentlyOn ? 0 : 1;
      toggle.checked = !currentlyOn;
    };

    card.appendChild(toggle);
    card.appendChild(content);

    // ✅ FIX: Append to itemList (NOT to tabItems or other global containers)
    itemList.appendChild(card);
  });
}


//render skills
function renderSkills() {
  const tabSkills = document.getElementById("tab-skills");
  tabSkills.innerHTML = "";

  skills.forEach(skill => {
  const level = player.skillLevels[skill.id] || 0;
  const xp = player.skillXP[skill.id] || 0;
  const baseXP = skill.baseXP || 1;
  const xpNeeded = getXPNeeded(level, baseXP);
  const { jobMultiplier, skillMultiplier } = calculateMultipliers();
  const xpPerTick = skillMultiplier * player.baseXP || 0;
  const percent = Math.min((xp / xpNeeded) * 100, 100);



    const row = document.createElement("div");
    row.className = "skill-row";

    const bar = document.createElement("div");
    bar.className = "xp-bar";
    bar.id = `bar-skill-${skill.id}`;

    bar.onclick = () => {
      player.activeSkill = player.activeSkill === skill.id ? null : skill.id;
    };

    if (player.activeSkill === skill.id) {
      bar.classList.add("active");
    }

    // Tooltip hover handlers
    bar.addEventListener("mouseenter", e => {
      const description = skill.description; // Grab description
      showTooltip(description, e.pageX, e.pageY);
    });

    bar.addEventListener("mousemove", e => {
      tooltip.style.left = `${e.pageX + 12}px`;
      tooltip.style.top = `${e.pageY + 12}px`;
    });

    bar.addEventListener("mouseleave", hideTooltip);

    bar.innerHTML = `
      <div class="xp-fill" id="fill-skill-${skill.id}" style="width: ${percent}%"></div>
      <div class="job-name" id="text-skill-${skill.id}">
        ${skill.name} (Lvl ${level})
      </div>
    `;

    const info = document.createElement("div");
    info.className = "job-info";
    info.innerHTML = `
      +${xpPerTick.toFixed(2)} XP/tick<br>
      ${xp.toFixed(1)} / ${xpNeeded} XP
    `;

    row.appendChild(bar);
    row.appendChild(info);
    tabSkills.appendChild(row);
  });
}





renderJobs();

setInterval(() => {
  gameTick();
  updateXPBars(); // ✅ run every tick

  if (tickCount % 3 === 0) {
    renderJobs();  // ✅ less frequent redraw
    renderStats();
    renderSkills();
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

document.getElementById("reset-button").addEventListener("click", () => {
  if (confirm("Are you sure you want to reset your progress? This cannot be undone.")) {
    localStorage.clear();
    location.reload(); // Refresh the page to start fresh
  }
});
