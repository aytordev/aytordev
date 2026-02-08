/**
 * SVG-specific assertion helpers
 * Reduces repeated SVG assertions throughout test suite
 */

import { expect } from "vitest";

export const svgAssertions = {
  /**
   * Assert SVG contains a valid group element
   */
  isValidGroup(svg: string): void {
    expect(svg).toContain("<g");
    expect(svg).toContain("</g>");
  },

  /**
   * Assert SVG contains specific element type
   */
  hasElement(svg: string, element: "text" | "rect" | "circle" | "path" | "line"): void {
    expect(svg).toContain(`<${element}`);
  },

  /**
   * Assert transform attribute is present with specific translation
   */
  hasTransform(svg: string, x: number, y: number): void {
    expect(svg).toContain(`transform="translate(${x}, ${y})"`);
  },

  /**
   * Assert element has specific class
   */
  hasClass(svg: string, className: string): void {
    expect(svg).toContain(`class="${className}"`);
  },

  /**
   * Assert clipPath is defined
   */
  hasClipPath(svg: string, id: string): void {
    expect(svg).toContain("<clipPath");
    expect(svg).toContain(`id="${id}"`);
  },

  /**
   * Assert SVG contains text content
   */
  hasText(svg: string, text: string): void {
    expect(svg).toContain(text);
  },

  /**
   * Composite assertion for basic renderer validation
   */
  isValidRenderer(svg: string, expectedClass: string, x: number, y: number): void {
    this.isValidGroup(svg);
    this.hasClass(svg, expectedClass);
    this.hasTransform(svg, x, y);
  },

  /**
   * Assert animation delay is present
   */
  hasAnimationDelay(svg: string, delay: number): void {
    expect(svg).toContain(`animation-delay: ${delay}s`);
  },

  /**
   * Assert keyframes are present
   */
  hasKeyframes(svg: string, name: string): void {
    expect(svg).toContain(`@keyframes ${name}`);
  },
};
