import { jobs } from "../data/jobs.js";
import { skills } from "../data/skills.js";

export function getJobById(id) {
  return jobs.find(job => job.id === id);
}

export function getSkillById(id) {
  return skills.find(skill => skill.id === id);
}

export function groupJobsByCategory(jobs) {
  const grouped = {};
  jobs.forEach(job => {
    const category = job.category || "Uncategorized";
    if (!grouped[category]) grouped[category] = [];
    grouped[category].push(job);
  });
  return grouped;
}

export function meetsRequirements(requirements, player) {
  return requirements.every(req => {
    if (req.jobId) {
      return (player.levels[req.jobId] || 0) >= req.level;
    } else if (req.skillId) {
      return (player.skillLevels[req.skillId] || 0) >= req.level;
    }
    return true; // fallback if no ID specified
  });
}



