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
