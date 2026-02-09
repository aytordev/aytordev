import type { AnimationConfig } from "../../../domain/entities/animation-config";
import type { TerminalContent, NeofetchData } from "../../../domain/entities/terminal-content";
import type { TerminalState } from "../../../domain/entities/terminal-state";
import type { Owner } from "../../../config/schema";
import type { JourneyEntry } from "../../../domain/value-objects/journey-entry";
import type { FeaturedRepo } from "../../../domain/value-objects/featured-repo";
import type { TimeOfDay } from "../../../domain/value-objects/time-of-day";
import { mockTerminalState } from "../../mocks/terminal-state";
import { TEST_DATES, TEST_DIMENSIONS } from "../constants";

interface StateBuilder {
  readonly withDimensions: (width: number, height: number) => StateBuilder;
  readonly withAnimation: (config: AnimationConfig) => StateBuilder;
  readonly withTimeOfDay: (timeOfDay: TimeOfDay) => StateBuilder;
  readonly withOwner: (owner: Partial<Owner>) => StateBuilder;
  readonly withContent: (content: Partial<TerminalContent>) => StateBuilder;
  readonly withNeofetchData: (data: Partial<NeofetchData>) => StateBuilder;
  readonly withJourney: (journey: ReadonlyArray<JourneyEntry>) => StateBuilder;
  readonly withFeaturedRepos: (repos: ReadonlyArray<FeaturedRepo>) => StateBuilder;
  readonly withContactCta: (cta: string) => StateBuilder;
  readonly withTheme: (themeName: string) => StateBuilder;
  readonly withTimestamp: (timestamp: Date) => StateBuilder;
  readonly with: (overrides: Partial<TerminalState>) => StateBuilder;
  readonly build: () => TerminalState;
}

const createBuilder = (state: TerminalState): StateBuilder => ({
  withDimensions: (width, height) =>
    createBuilder({ ...state, dimensions: { width, height } }),

  withAnimation: (config) =>
    createBuilder({ ...state, animation: config }),

  withTimeOfDay: (timeOfDay) =>
    createBuilder({ ...state, timeOfDay }),

  withOwner: (owner) =>
    createBuilder({ ...state, owner: { ...state.owner, ...owner } }),

  withContent: (content) =>
    createBuilder({ ...state, content: { ...state.content, ...content } }),

  withNeofetchData: (data) =>
    createBuilder({
      ...state,
      content: {
        ...state.content,
        neofetchData: { ...state.content.neofetchData, ...data },
      },
    }),

  withJourney: (journey) =>
    createBuilder({ ...state, content: { ...state.content, journey } }),

  withFeaturedRepos: (repos) =>
    createBuilder({ ...state, content: { ...state.content, featuredRepos: repos } }),

  withContactCta: (cta) =>
    createBuilder({ ...state, content: { ...state.content, contactCta: cta } }),

  withTheme: (themeName) =>
    createBuilder({ ...state, themeName }),

  withTimestamp: (timestamp) =>
    createBuilder({ ...state, timestamp }),

  with: (overrides) =>
    createBuilder({ ...state, ...overrides }),

  build: () => state,
});

const defaultState: TerminalState = {
  ...mockTerminalState,
  dimensions: TEST_DIMENSIONS.DEFAULT,
  timestamp: TEST_DATES.DEFAULT,
};

export const terminalStateBuilder = (): StateBuilder => createBuilder(defaultState);
