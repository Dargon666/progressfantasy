import { gameTick, tickCount } from "./core/gameLoop.js";
import { jobs } from "./data/jobs.js";
import { player, loadGame, saveGame, initPlayer} from "./core/player.js";
import { items } from "./data/items.js";
import { skills } from "./data/skills.js";
import { calculateMultipliers, getXPNeeded, getStatMultiplier, calculateStatMultiplier } from "./utils/xpUtils.js";
import { formatGold } from "./utils/format.js";
import { getJobById, getSkillById, groupJobsByCategory, meetsRequirements } from "./utils/dataUtils.js";
import { encodeSave, decodeSave } from "./utils/saveUtils.js";


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



let selectedJobCategory = null;

function renderJobs() {
  const tabJobs = document.getElementById("tab-jobs");
  tabJobs.innerHTML = "";

  const groupedJobs = groupJobsByCategory(jobs);

// Only keep categories with at least one unlocked job
const unlockedGroupedJobs = {};
for (const [category, jobList] of Object.entries(groupedJobs)) {
  const hasUnlocked = jobList.some(job =>
    !job.unlock || meetsRequirements(Array.isArray(job.unlock) ? job.unlock : [job.unlock], player)
  );

  if (hasUnlocked) {
    unlockedGroupedJobs[category] = jobList;
  }




  if (hasUnlocked) {
    unlockedGroupedJobs[category] = jobList;
  }
}

const categories = Object.keys(unlockedGroupedJobs);


  if (!selectedJobCategory || !categories.includes(selectedJobCategory)) {
    selectedJobCategory = categories[0];
  }

  // Sub-tab buttons
  const tabRow = document.createElement("div");
  tabRow.id = "job-subtabs";
  tabRow.style.marginBottom = "10px";

  categories.forEach(cat => {
    const btn = document.createElement("button");
    btn.className = "sub-tab";
    btn.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    if (cat === selectedJobCategory) btn.classList.add("active");

    btn.onclick = () => {
      selectedJobCategory = cat;
      renderJobs(); // re-render with new selection
    };

    tabRow.appendChild(btn);
  });

  tabJobs.appendChild(tabRow);

  // Jobs in selected category
  const jobList = groupedJobs[selectedJobCategory];
  jobList.forEach(job => {
    const jobLevel = player.levels[job.id] || 0;

const isUnlocked = !job.unlock || meetsRequirements(Array.isArray(job.unlock) ? job.unlock : [job.unlock], player);




    if (!isUnlocked) return;

    const bar = document.createElement("div");
    bar.className = "xp-bar";
    bar.id = `bar-job-${job.id}`;

    bar.onclick = () => {
      player.activeJob = player.activeJob === job.id ? null : job.id;
    };

    if (player.activeJob === job.id) {
      bar.classList.add("active");
    }

    const level = jobLevel;
    const xp = player.xp[job.id] || 0;
    const baseXP = job.baseXP || 1;
    const xpNeeded = getXPNeeded(level, baseXP);
    const income = job.income * Math.max(1, level);
    const percent = Math.min((xp / xpNeeded) * 100, 100);
    const jobMultiplier = getStatMultiplier(job.xpBoostFromStats || {});

    // Tooltip
    bar.addEventListener("mouseenter", e => {
      showTooltip(job.description || "No description.", e.pageX, e.pageY);
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

    const base = player.baseXP || 1;
const jobStatBonus = calculateStatMultiplier(job); // optional
const otherJobMult = jobMultiplier / jobStatBonus || 1;
const jobXpGain = base * jobMultiplier;
// 📌 Format stat-based XP bonuses
let statBonusDisplay = "";
if (job.xpBoostFromStats) {
  const parts = [];
  for (const stat in job.xpBoostFromStats) {
    const boostPerPoint = job.xpBoostFromStats[stat] * 100;
    parts.push(`${stat.charAt(0).toUpperCase() + stat.slice(1)} +${boostPerPoint.toFixed(1)}%/point`);
  }
  statBonusDisplay = parts.length ? `Stat Bonuses: ${parts.join(", ")}` : "";
}

const info = document.createElement("div");
info.className = "job-info";
info.innerHTML = `
  ${statBonusDisplay}<br>
  ${xp.toFixed(1)} / ${xpNeeded} XP
`;



    tabJobs.appendChild(bar);
    tabJobs.appendChild(info);
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
    const statMultiplier = getStatMultiplier(job.xpBoostFromStats || {});
    const xpPerTick = 1 * jobMultiplier * statMultiplier;
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
    const statMultiplier = getStatMultiplier(skill.xpBoostFromStats || {});
    const xpPerTick = 1 * skillMultiplier * statMultiplier;

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


let selectedSkillCategory = null;

function groupSkillsByCategory(skillsList) {
  const grouped = {};
  skillsList.forEach(skill => {
    if (!grouped[skill.category]) {
      grouped[skill.category] = [];
    }
    grouped[skill.category].push(skill);
  });
  return grouped;
}

function renderSkills() {
  const tabSkills = document.getElementById("tab-skills");
  tabSkills.innerHTML = "";

  const groupedSkills = groupSkillsByCategory(skills);

  // Filter to only show categories with at least one unlocked skill
  const unlockedGroupedSkills = {};
  for (const [category, skillList] of Object.entries(groupedSkills)) {
   const hasUnlocked = skillList.some(skill =>
  !skill.unlock || meetsRequirements(Array.isArray(skill.unlock) ? skill.unlock : [skill.unlock], player)
);

    if (hasUnlocked) {
      unlockedGroupedSkills[category] = skillList;
    }
  }

  const categories = Object.keys(unlockedGroupedSkills);

// 🔒 Reset selection if invalid
if (!categories.includes(selectedSkillCategory)) {
  selectedSkillCategory = categories[0] || null;
}

// 🔁 Bail early if there's nothing to show
if (!selectedSkillCategory) return;


  if (!selectedSkillCategory || !categories.includes(selectedSkillCategory)) {
    selectedSkillCategory = categories[0];
  }

  // Sub-tab buttons
  const tabRow = document.createElement("div");
  tabRow.id = "skill-subtabs";
  tabRow.style.marginBottom = "10px";

  categories.forEach(cat => {
    const btn = document.createElement("button");
    btn.className = "sub-tab";
    btn.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    if (cat === selectedSkillCategory) btn.classList.add("active");

    btn.onclick = () => {
      selectedSkillCategory = cat;
      renderSkills(); // re-render on tab switch
    };

    tabRow.appendChild(btn);
  });

  tabSkills.appendChild(tabRow);

  // Show skills for the selected category
const skillList = unlockedGroupedSkills[selectedSkillCategory];

  skillList.forEach(skill => {
    const isUnlocked = !skill.unlock || meetsRequirements(Array.isArray(skill.unlock) ? skill.unlock : [skill.unlock], player);

    if (!isUnlocked) return;

    const level = player.skillLevels[skill.id] || 0;
    const xp = player.skillXP[skill.id] || 0;
    const baseXP = skill.baseXP || 1;
    const xpNeeded = getXPNeeded(level, baseXP);
    const { skillMultiplier } = calculateMultipliers();
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

    bar.addEventListener("mouseenter", e => {
      showTooltip(skill.description || "No description.", e.pageX, e.pageY);
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

    // Stat bonus display
    let statBonusDisplay = "";
    if (skill.xpBoostFromStats) {
      const parts = [];
      for (const stat in skill.xpBoostFromStats) {
        const boostPerPoint = skill.xpBoostFromStats[stat] * 100;
        parts.push(`${stat.charAt(0).toUpperCase() + stat.slice(1)} +${boostPerPoint.toFixed(1)}%/point`);
      }
      statBonusDisplay = parts.length ? `Stat Bonuses: ${parts.join(", ")}` : "";
    }
    let statGainDisplay = "";
if (skill.statGain) {
  const parts = [];
  for (const stat in skill.statGain) {
    parts.push(`${stat.charAt(0).toUpperCase() + stat.slice(1)} +${skill.statGain[stat]}`);
  }
  statGainDisplay = parts.length ? `Stat Gain: ${parts.join(", ")}` : "";
}


    const info = document.createElement("div");
    info.className = "job-info";
    info.innerHTML = `
  +${xpPerTick.toFixed(2)} XP/tick<br>
  ${xp.toFixed(1)} / ${xpNeeded} XP<br>
  ${statBonusDisplay ? `${statBonusDisplay}<br>` : ""}
  ${statGainDisplay}
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


// --- Reset the game ---
function resetGame() {
  if (confirm("Are you sure you want to reset your progress?")) {
    localStorage.removeItem("progressFantasySave");
    location.reload();
  }
}

// Export to base64 file
function exportSave() {
  const encoded = encodeSave(player);
  const blob = new Blob([encoded], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "progress_fantasy_save.txt";
  a.click();
  URL.revokeObjectURL(url);
}

// Import from base64 file
function importSave(file) {
  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const base64 = e.target.result.trim();
      const importedData = decodeSave(base64);
      Object.assign(player, importedData);
      saveGame(); // save to localStorage
      location.reload();
    } catch (err) {
      alert("Invalid save file. Please ensure it's a valid base64 export.");
    }
  };
  reader.readAsText(file);
}

document.getElementById("save-button").onclick = saveGame;
document.getElementById("reset-button").onclick = resetGame;
document.getElementById("export-button").onclick = exportSave;

document.getElementById("import-button").onclick = () => {
  document.getElementById("import-file").click();
};
document.getElementById("import-file").onchange = (e) => {
  if (e.target.files.length > 0) {
    importSave(e.target.files[0]);
  }
};


