import type { Result } from "../shared/result";
import { err, ok } from "../shared/result";

export class BudgetError extends Error {
  constructor(
    public readonly metric: string,
    public readonly actual: number,
    public readonly limit: number,
  ) {
    super(`Budget exceeded: ${metric} is ${actual}, limit is ${limit}`);
  }
}

export const validateBudget = (svg: string): Result<void, BudgetError> => {
  // 1. File Size
  const size = Buffer.byteLength(svg, "utf-8");
  if (size > 80_000) {
    return err(new BudgetError("SVG size (bytes)", size, 80_000));
  }

  // 2. Element Count (Rough approximation via tag counting)
  // Matches <tag or </tag, but spec says "DOM elements", usually opening tags.
  // Regex <[a-zA-Z]+ matches start of tag.
  const elementCount = (svg.match(/<[a-z]+/gi) || []).length;
  if (elementCount > 400) {
    return err(new BudgetError("Element count", elementCount, 400));
  }

  // 3. Complexity Metrics
  const animationCount = (svg.match(/@keyframes/g) || []).length;
  if (animationCount > 5) {
    return err(new BudgetError("Animation count", animationCount, 5));
  }

  const filterCount = (svg.match(/<filter/g) || []).length;
  if (filterCount > 2) {
    return err(new BudgetError("Filter count", filterCount, 2));
  }

  const gradientCount = (svg.match(/<linearGradient|<radialGradient/g) || [])
    .length;
  if (gradientCount > 10) {
    return err(new BudgetError("Gradient count", gradientCount, 10));
  }

  return ok(undefined);
};
