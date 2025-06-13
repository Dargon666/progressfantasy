export const player = {
  gold: 0,
  xp: {},
  levels: {},
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