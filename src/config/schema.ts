import { z } from "zod";

const TechStackCategorySchema = z.object({
  name: z.string().min(1).max(20),
  items: z.array(z.string().max(20)).max(10),
});

const ContactItemSchema = z.object({
  label: z.string().min(1).max(20),
  value: z.string().min(1).max(50),
  icon: z.string().max(4).default(""),
});

export const OwnerSchema = z.object({
  name: z.string().min(1).max(50),
  username: z
    .string()
    .regex(/^[a-z0-9-]+$/i)
    .max(39),
  title: z.string().max(50),
  location: z.string().max(50),
  timezone: z.string(),
});

export const SystemInfoSchema = z.object({
  os: z.string().min(1).max(30),
  shell: z.string().min(1).max(20),
  editor: z.string().min(1).max(50),
  terminal: z.string().min(1).max(20),
  wm: z.string().max(20).optional(),
  theme: z.string().min(1).max(30),
});

export const JourneyEntrySchema = z.object({
  year: z.number().int().min(1900).max(2100),
  icon: z.string().min(1).max(4),
  title: z.string().min(1).max(60),
  tags: z.array(z.string().max(20)).max(5).optional(),
});

export const ThemeSchema = z.enum(["kanagawa-wave", "kanagawa-dragon", "kanagawa-lotus"]);

export const DimensionsSchema = z.object({
  width: z.number().min(400).max(1200).default(800),
  height: z.number().min(200).max(1200).default(400),
});

export const TmuxSchema = z.object({
  session_name: z.string().max(20).default("dev"),
  windows: z.array(z.string().max(10)).max(5).default(["zsh"]),
  show_stats: z.boolean().default(true),
});

export const PromptSchema = z.object({
  show_git: z.boolean().default(true),
  show_node: z.boolean().default(true),
  show_nix: z.boolean().default(true),
  show_time: z.boolean().default(true),
});

export const TechStackSchema = z.object({
  categories: z.array(TechStackCategorySchema).max(6).default([]),
});

export const FeaturedReposConfigSchema = z.object({
  source: z.enum(["pinned", "stars"]).default("stars"),
  limit: z.number().int().min(1).max(5).default(3),
});

export const ContactSchema = z.object({
  cta: z.string().max(60).default("Let's connect! 💬"),
  items: z.array(ContactItemSchema).max(4).default([]),
});

export const EffectsSchema = z.object({
  cursor_blink: z.boolean().default(true),
  gradient_bars: z.boolean().default(true),
  subtle_glow: z.boolean().default(false),
});

export const GitHubSchema = z.object({
  max_repos: z.number().min(1).max(100).default(10),
  include_private: z.boolean().default(false),
});

export const AnimationSchema = z
  .object({
    enabled: z.boolean().default(true),
    speed: z.number().min(0.1).max(5).default(1),
    initialDelay: z.number().min(0).max(10).default(0.5),
  })
  .optional();

export const ConfigSchema = z
  .object({
    version: z.literal(2),
    profile_mode: z.literal("story-driven").default("story-driven"),
    owner: OwnerSchema,
    system: SystemInfoSchema,
    journey: z.array(JourneyEntrySchema).max(10),
    theme: ThemeSchema.default("kanagawa-wave"),
    dimensions: DimensionsSchema.optional(),
    tmux: TmuxSchema.optional(),
    prompt: PromptSchema.optional(),
    tech_stack: TechStackSchema.optional(),
    featured_repos: FeaturedReposConfigSchema.optional(),
    contact: ContactSchema.optional(),
    effects: EffectsSchema.optional(),
    github: GitHubSchema.optional(),
    animation: AnimationSchema,
  })
  .strict();

export type Config = z.infer<typeof ConfigSchema>;
export type Owner = z.infer<typeof OwnerSchema>;
export type SystemInfo = z.infer<typeof SystemInfoSchema>;
export type JourneyEntry = z.infer<typeof JourneyEntrySchema>;
export type Theme = z.infer<typeof ThemeSchema>;
export type Dimensions = z.infer<typeof DimensionsSchema>;
export type Tmux = z.infer<typeof TmuxSchema>;
export type Prompt = z.infer<typeof PromptSchema>;
export type TechStack = z.infer<typeof TechStackSchema>;
export type FeaturedReposConfig = z.infer<typeof FeaturedReposConfigSchema>;
export type Contact = z.infer<typeof ContactSchema>;
export type Effects = z.infer<typeof EffectsSchema>;
export type GitHub = z.infer<typeof GitHubSchema>;
export type Animation = z.infer<typeof AnimationSchema>;
