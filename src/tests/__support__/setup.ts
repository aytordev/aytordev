/**
 * Global test setup
 * Runs before each test to ensure clean state
 */
import { afterEach, beforeEach, vi } from "vitest";

// Reset all mocks between tests to prevent test pollution
beforeEach(() => {
  vi.clearAllMocks();
});

// Restore all mocks after tests
afterEach(() => {
  vi.restoreAllMocks();
});
