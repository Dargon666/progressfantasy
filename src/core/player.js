export const player = {
  gold: 0,
  xp: {},
  levels: {},
  items: {}, // key: item.id, value: level
  activeJob: null
};

export function initPlayer(jobs) {
  jobs.forEach(job => {
    player.xp[job.id] = 0;
    player.levels[job.id] = 0;
  });
}

export function checkJobLevelUp(jobId) {
  const xp = player.xp[jobId];
  const level = player.levels[jobId];
  const xpNeeded = 10 + level * 15;

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
  return 10 + level * 15;
}