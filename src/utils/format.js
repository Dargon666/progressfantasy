// utils/format.js
export function formatGold(value) {
  const suffixes = ["", "K", "M", "B", "T", "Q"];
  let tier = Math.floor(Math.log10(Math.max(value, 1)) / 3);
  tier = Math.min(tier, suffixes.length - 1);

  const scaled = value / Math.pow(10, tier * 3);
  return scaled.toFixed(1) + suffixes[tier];
}
export function formatXP(value) {
  const suffixes = ["", "K", "M", "B", "T", "Q"];
  let tier = Math.floor(Math.log10(Math.max(value, 1)) / 3);
  tier = Math.min(tier, suffixes.length - 1);

  const scaled = value / Math.pow(10, tier * 3);
  return scaled.toFixed(1) + suffixes[tier];
}