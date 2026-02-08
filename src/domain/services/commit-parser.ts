import type { CommitType } from "../value-objects/commit";

export const parseCommitType = (message: string): CommitType => {
  const match = message.match(/^(feat|fix|docs|style|refactor|test|chore)/i);
  if (match) {
    return match[1].toLowerCase() as CommitType;
  }
  return "chore";
};

export const parseCommitEmoji = (message: string): string => {
  const emojiMatch = message.match(/^(:\w+:|[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}])/u);
  if (emojiMatch) return emojiMatch[1];

  const type = parseCommitType(message);
  const emojiMap: Record<CommitType, string> = {
    feat: "✨",
    fix: "🐛",
    docs: "📝",
    style: "💄",
    refactor: "♻️",
    test: "✅",
    chore: "🔧",
  };
  return emojiMap[type];
};
