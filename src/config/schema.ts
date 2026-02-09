import { z } from "zod";

const TechStackCategorySchema = z.object({
  name: z.string().min(1).max(20),
  items: z.array(z.string().max(20)).max(10),
});

const ContactItemSchema = z.object({
  label: z.string().min(1).max(20),
  value: z.string().min(1).max(50),
  icon: z.string().max(4),
});

const ExtraLineSchema = z.string().max(80);

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

export const ThemeSchema = z.enum([
  "kanagawa-wave",
  "kanagawa-dragon",
  "kanagawa-lotus",
]);

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

export const ContentSchema = z.object({
  developer_info: z
    .object({
      enabled: z.boolean().default(true),
      tagline: z.string().max(80).optional(),
    })
    .optional(),

  ascii_art: z.string().optional(),

  tech_stack: z
    .object({
      enabled: z.boolean().default(true),
      categories: z.array(TechStackCategorySchema).max(4).default([]),
    })
    .optional(),

  language_stats: z
    .object({
      enabled: z.boolean().default(true),
      max_languages: z.number().min(1).max(10).default(5),
      show_other: z.boolean().default(true),
    })
    .optional(),

  commits: z
    .object({
      enabled: z.boolean().default(true),
      max_count: z.number().min(1).max(10).default(5),
    })
    .optional(),

  streak: z
    .object({
      enabled: z.boolean().default(true),
    })
    .optional(),

  learning: z
    .object({
      enabled: z.boolean().default(false),
      current: z.string().max(50).optional(),
    })
    .optional(),

  current_focus: z
    .object({
      enabled: z.boolean().default(false),
      text: z.string().max(60).optional(),
    })
    .optional(),

  contact: z
    .object({
      enabled: z.boolean().default(false),
      items: z.array(ContactItemSchema).max(4).default([]),
    })
    .optional(),

  extra_lines: z.array(ExtraLineSchema).max(3).optional(),
});

export const GrowthSchema = z.object({
  powered_by: z
    .object({
      enabled: z.boolean().default(true),
      text: z.string().max(40).default("Powered by terminal-profile"),
    })
    .optional(),
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
    enabled: z.boolean().default(false),
    speed: z.number().min(0.1).max(5).default(1),
    initialDelay: z.number().min(0).max(10).default(0.5),
  })
  .optional();

export const ConfigSchema = z
  .object({
    version: z.literal(1),
    owner: OwnerSchema,
    theme: ThemeSchema.default("kanagawa-wave"),
    dimensions: DimensionsSchema.optional(),
    tmux: TmuxSchema.optional(),
    prompt: PromptSchema.optional(),
    content: ContentSchema.optional(),
    growth: GrowthSchema.optional(),
    effects: EffectsSchema.optional(),
    github: GitHubSchema.optional(),
    animation: AnimationSchema,
  })
  .strict();

export type Config = z.infer<typeof ConfigSchema>;
export type Owner = z.infer<typeof OwnerSchema>;
export type Theme = z.infer<typeof ThemeSchema>;
export type Dimensions = z.infer<typeof DimensionsSchema>;
export type Tmux = z.infer<typeof TmuxSchema>;
export type Prompt = z.infer<typeof PromptSchema>;
export type Content = z.infer<typeof ContentSchema>;
export type Growth = z.infer<typeof GrowthSchema>;
export type Effects = z.infer<typeof EffectsSchema>;
export type GitHub = z.infer<typeof GitHubSchema>;
export type Animation = z.infer<typeof AnimationSchema>;
