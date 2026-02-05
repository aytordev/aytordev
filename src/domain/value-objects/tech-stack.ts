export interface TechStackCategory {
  readonly name: string;
  readonly items: readonly string[];
}

export interface TechStack {
  readonly categories: readonly TechStackCategory[];
}
