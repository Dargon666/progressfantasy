export const player = {
  gold: 0,
  xp: {},             // job XP
  levels: {},         // job levels
  skillXP: {},        // skill XP
  skillLevels: {},    // skill levels
  items: {},
  activeJob: null
};

export function initPlayer(jobs, skills) {
  jobs.forEach(job => {
    player.xp[job.id] = 0;
    player.levels[job.id] = 0;
  });

  skills.forEach(skill => {
    player.skillXP[skill.id] = 0;
    player.skillLevels[skill.id] = 0;
  });
}

export function checkSkillLevelUp(skillId) {
  const xp = player.skillXP[skillId];
  const level = player.skillLevels[skillId];
  const xpNeeded = getXPNeeded(level);

  if (xp >= xpNeeded) {
    player.skillLevels[skillId]++;
    player.skillXP[skillId] -= xpNeeded;
    console.log(`🔹 ${skillId} leveled up! Now level ${player.skillLevels[skillId]}`);
  }
}

export function checkJobLevelUp(jobId) {
  const xp = player.xp[jobId];
  const level = player.levels[jobId];
  const xpNeeded = getXPNeeded(level);

  if (xp >= xpNeeded) {
    player.levels[jobId]++;
    player.xp[jobId] -= xpNeeded;
    console.log(`✨ ${jobId} leveled up! Now level ${player.levels[jobId]}`);
  }
}


const SAVE_KEY = "progressFantasySave";

export function saveGame() {
  const saveData = JSON.stringify(player);
  localStorage.setItem(SAVE_KEY, saveData);
}

export function loadGame(jobs) {
  const data = localStorage.getItem(SAVE_KEY);
  if (!data) return initPlayer(jobs);

  try {
    const parsed = JSON.parse(data);
    Object.assign(player, parsed);

    // Ensure all job keys are present (for new jobs)
    jobs.forEach(job => {
      if (!(job.id in player.xp)) player.xp[job.id] = 0;
      if (!(job.id in player.levels)) player.levels[job.id] = 0;
    });
  } catch (e) {
    console.error("Failed to load save:", e);
    initPlayer(jobs); // fallback
  }
}

export function getXPNeeded(level) {
  const base = 10;        // XP required to go from level 0 to 1
  const growth = 1.1;     // Scaling factor per level

  return Math.floor(base * Math.pow(growth, level));
}
