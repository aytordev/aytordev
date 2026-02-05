export const createSkillGradient = (
  id: string,
  startColor: string,
  endColor: string,
): string => {
  return `
    <linearGradient id="${id}" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${startColor}" />
      <stop offset="100%" stop-color="${endColor}" />
    </linearGradient>
  `.trim();
};
