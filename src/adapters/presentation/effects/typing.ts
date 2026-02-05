/**
 * Generates CSS for a typing animation.
 * Limited to single line to respect performance constraints.
 */
export const typingKeyframes = `
@keyframes typing {
  from { width: 0 }
  to { width: 100% }
}
@keyframes blink-caret {
  from, to { border-color: transparent }
  50% { border-color: var(--cursor) }
}
`;

/**
 * Wraps text with typing animation classes/styles.
 * Implementation uses ch units for width to ensure perfect timing.
 */
export function wrapWithTyping(text: string, duration = "3.5s"): string {
  // We use inline styles for the specific character width to make the steps accurate
  const charCount = text.length;
  const style = `overflow: hidden; border-right: .15em solid var(--cursor); white-space: nowrap; margin: 0 auto; letter-spacing: .15em; animation: typing ${duration} steps(${charCount}, end), blink-caret .75s step-end infinite; width: ${charCount}ch;`;

  // Note: 'margin: 0 auto' centers it, but for terminal left-align we usually want margin: 0.
  // We'll adjust style for standard terminal look (left aligned).

  const termStyle = `
    overflow: hidden;
    border-right: 2px solid;
    white-space: nowrap;
    animation: typing ${duration} steps(${charCount}), blink-caret 0.75s step-end infinite;
    display: inline-block;
    vertical-align: bottom;
    width: ${charCount}ch;
  `;

  return `<span style="${termStyle.replace(/\n/g, "")}">${text}</span>`;
}
