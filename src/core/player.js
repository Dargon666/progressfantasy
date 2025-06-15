import { getJobById, getSkillById } from "../utils/dataUtils.js";
import { getXPNeeded } from "../utils/xpUtils.js";
import { jobs } from "../data/jobs.js";
import { skills } from "../data/skills.js";

export const player = {
  gold: 0,
  xp: {},             // job XP
  levels: {},         // job levels
  skillXP: {},        // skill XP
  skillLevels: {},    // skill levels
  baseXP: 1,
  stats: {
    strength: 1,
    intelligence: 1,
    dexterity: 1,
    agility: 1,
    charisma: 1,
    wisdom: 1,
  },
  items: {},
  activeJob: null,
  activeSkill: null
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
  const baseXP = getSkillById(skillId)?.baseXP || 1;
  const xpNeeded = getXPNeeded(level, baseXP);
  const skill = skills.find(s => s.id === skillId); // ⬅️ make sure you import `skills`

  if (xp >= xpNeeded) {
    player.skillLevels[skillId]++;
    player.skillXP[skillId] -= xpNeeded;
    if (skill.statGain) {
      for (const [stat, amount] of Object.entries(skill.statGain)) {
        player.stats[stat] = (player.stats[stat] || 0) + amount;
      }
    }
    console.log(`🔹 ${skillId} leveled up! Now level ${player.skillLevels[skillId]}`);
  }
}


export function checkJobLevelUp(jobId) {
  const xp = player.xp[jobId];
  const level = player.levels[jobId];
  const job = jobs.find(j => j.id === jobId); // ⬅️ make sure you import `jobs`

  const xpNeeded = getXPNeeded(level, job.baseXP);

  if (xp >= xpNeeded) {
    player.levels[jobId]++;
    player.xp[jobId] -= xpNeeded;
    console.log(`✨ ${jobId} leveled up! Now level ${player.levels[jobId]}`);

    // 🆕 Apply stat gains
    if (job.statGain) {
      for (const [stat, amount] of Object.entries(job.statGain)) {
        player.stats[stat] = (player.stats[stat] || 0) + amount;
      }
    }
  }
}



const SAVE_KEY = "progressFantasySave";

export function saveGame() {
  const saveData = JSON.stringify(player);
  localStorage.setItem(SAVE_KEY, saveData);
}

export function loadGame(jobs, skills) {
  const data = localStorage.getItem(SAVE_KEY);
  if (!data) return initPlayer(jobs, skills);

  try {
    const parsed = JSON.parse(data);
    Object.assign(player, parsed);

    // Ensure all job keys are present (for new jobs)
    jobs.forEach(job => {
      if (!(job.id in player.xp)) player.xp[job.id] = 0;
      if (!(job.id in player.levels)) player.levels[job.id] = 0;
    });

    // Ensure all skill keys are present (for new skills)
    skills.forEach(skill => {
      if (!(skill.id in player.skillXP)) player.skillXP[skill.id] = 0;
      if (!(skill.id in player.skillLevels)) player.skillLevels[skill.id] = 0;
    });
  } catch (e) {
    console.error("Failed to load save:", e);
    initPlayer(jobs, skills); // fallback
  }
}
