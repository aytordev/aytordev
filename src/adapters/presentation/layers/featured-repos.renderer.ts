import type { FeaturedRepo } from "../../../domain/value-objects/featured-repo";
import { sanitizeForSvg } from "../../../shared/sanitize";
import type { Theme } from "../../../theme/types";

const LINE_HEIGHT = 36;
const ROW_BOTTOM_EXTENT = 19; // desc text (y=16) + descent (~3px)
const STAR_ICON = "\u2605";

const renderLanguageDot = (repo: FeaturedRepo, x: number): string => {
  if (!repo.primaryLanguage) return "";
  return (
    `<circle cx="${x}" cy="-4" r="5" fill="${repo.primaryLanguage.color}"/>` +
    `<text x="${x + 10}" y="0" fill="${repo.primaryLanguage.color}" font-family="monospace" font-size="10">${sanitizeForSvg(repo.primaryLanguage.name)}</text>`
  );
};

const renderRepo = (repo: FeaturedRepo, index: number, theme: Theme): string => {
  const y = index * LINE_HEIGHT;

  const starSvg = `<text x="0" y="0" fill="${theme.colors.carpYellow}" font-family="monospace" font-size="12">${STAR_ICON} ${repo.stargazerCount}</text>`;

  const nameSvg = `<text x="60" y="0" fill="${theme.colors.springBlue}" font-family="monospace" font-size="12" font-weight="bold">${sanitizeForSvg(repo.nameWithOwner)}</text>`;

  const descSvg = repo.description
    ? `<text x="60" y="16" fill="${theme.colors.textSecondary}" font-family="monospace" font-size="11">${sanitizeForSvg(repo.description)}</text>`
    : "";

  const langSvg = renderLanguageDot(repo, 400);

  return `<g transform="translate(0, ${y})">${starSvg}\n${nameSvg}\n${descSvg}\n${langSvg}</g>`;
};

export const calculateFeaturedReposHeight = (repos: ReadonlyArray<FeaturedRepo>): number => {
  if (repos.length === 0) return 0;
  return (repos.length - 1) * LINE_HEIGHT + ROW_BOTTOM_EXTENT;
};

export const renderFeaturedRepos = (
  repos: ReadonlyArray<FeaturedRepo>,
  theme: Theme,
  y: number = 0,
): Readonly<{ svg: string; height: number }> => {
  const height = calculateFeaturedReposHeight(repos);

  if (repos.length === 0) {
    return { svg: `<g id="featured-repos" transform="translate(0, ${y})"></g>`, height: 0 };
  }

  const reposSvg = repos.map((repo, i) => renderRepo(repo, i, theme)).join("\n");

  const svg = `<g id="featured-repos" transform="translate(0, ${y})">` + reposSvg + `</g>`;

  return { svg, height };
};
