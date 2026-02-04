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

export const ConfigSchema = z
  .object({
    version: z.literal(1),

    owner: z.object({
      name: z.string().min(1).max(50),
      username: z
        .string()
        .regex(/^[a-z0-9-]+$/i)
        .max(39),
      title: z.string().max(50),
      location: z.string().max(50),
      timezone: z.string(),
    }),

    theme: z
      .enum([
        "kanagawa-wave",
        "kanagawa-dragon",
        "kanagawa-lotus",
        "catppuccin-mocha",
        "catppuccin-latte",
        "tokyo-night",
        "dracula",
      ])
      .default("kanagawa-wave"),

    dimensions: z
      .object({
        width: z.number().min(400).max(1200).default(800),
        height: z.number().min(200).max(600).default(400),
      })
      .optional(),

    tmux: z
      .object({
        session_name: z.string().max(20).default("dev"),
        windows: z.array(z.string().max(10)).max(5).default(["zsh"]),
        show_stats: z.boolean().default(true),
      })
      .optional(),

    prompt: z
      .object({
        show_git: z.boolean().default(true),
        show_node: z.boolean().default(true),
        show_nix: z.boolean().default(true),
        show_time: z.boolean().default(true),
      })
      .optional(),

    content: z
      .object({
        developer_info: z
          .object({
            enabled: z.boolean().default(true),
            tagline: z.string().max(80).optional(),
          })
          .optional(),

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
      })
      .optional(),

    growth: z
      .object({
        powered_by: z
          .object({
            enabled: z.boolean().default(true),
            text: z.string().max(40).default("Powered by terminal-profile"),
          })
          .optional(),
      })
      .optional(),

    effects: z
      .object({
        cursor_blink: z.boolean().default(true),
        gradient_bars: z.boolean().default(true),
        subtle_glow: z.boolean().default(false),
      })
      .optional(),

    github: z
      .object({
        max_repos: z.number().min(1).max(100).default(10),
        include_private: z.boolean().default(false),
      })
      .optional(),
  })
  .strict();

export type Config = z.infer<typeof ConfigSchema>;
