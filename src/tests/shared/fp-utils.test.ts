import { describe, expect, it } from "vitest";
import { pipe, compose, curry2, curry3, identity, constant } from "../../shared/fp-utils";

describe("Functional Programming Utilities", () => {
  describe("pipe", () => {
    it("should apply functions left-to-right", () => {
      const result = pipe(
        5,
        (x) => x * 2,
        (x) => x + 1,
        (x) => x * 3,
      );
      expect(result).toBe(33); // ((5 * 2) + 1) * 3 = 33
    });

    it("should handle single function", () => {
      const result = pipe(5, (x) => x * 2);
      expect(result).toBe(10);
    });

    it("should handle no functions (returns initial)", () => {
      const result = pipe(5);
      expect(result).toBe(5);
    });

    it("should work with different types at same level", () => {
      const result = pipe(
        10,
        (x) => x / 2,
        (x) => x + 3,
      );
      expect(result).toBe(8); // (10 / 2) + 3 = 8
    });
  });

  describe("compose", () => {
    it("should apply functions right-to-left", () => {
      const multiplyBy2 = (x: number) => x * 2;
      const add1 = (x: number) => x + 1;
      const subtract3 = (x: number) => x - 3;

      const composed = compose(multiplyBy2, add1, subtract3);
      const result = composed(5);

      // Right to left: 5 - 3 = 2, 2 + 1 = 3, 3 * 2 = 6
      expect(result).toBe(6);
    });

    it("should handle single function", () => {
      const double = (x: number) => x * 2;
      const composed = compose(double);

      expect(composed(5)).toBe(10);
    });

    it("should create reusable composed function", () => {
      const addThenDouble = compose(
        (x: number) => x * 2,
        (x: number) => x + 5,
      );

      expect(addThenDouble(3)).toBe(16); // (3 + 5) * 2
      expect(addThenDouble(10)).toBe(30); // (10 + 5) * 2
    });
  });

  describe("curry2", () => {
    it("should curry a 2-parameter function", () => {
      const add = (a: number, b: number) => a + b;
      const curriedAdd = curry2(add);

      expect(curriedAdd(5)(3)).toBe(8);
    });

    it("should create partially applied functions", () => {
      const multiply = (a: number, b: number) => a * b;
      const curriedMultiply = curry2(multiply);

      const double = curriedMultiply(2);
      const triple = curriedMultiply(3);

      expect(double(5)).toBe(10);
      expect(triple(5)).toBe(15);
    });

    it("should work with different types", () => {
      const concat = (a: string, b: string) => a + b;
      const curriedConcat = curry2(concat);

      expect(curriedConcat("Hello, ")("World!")).toBe("Hello, World!");
    });
  });

  describe("curry3", () => {
    it("should curry a 3-parameter function", () => {
      const sum3 = (a: number, b: number, c: number) => a + b + c;
      const curriedSum = curry3(sum3);

      expect(curriedSum(1)(2)(3)).toBe(6);
    });

    it("should create partially applied functions at each level", () => {
      const sum3 = (a: number, b: number, c: number) => a + b + c;
      const curriedSum = curry3(sum3);

      const add10 = curriedSum(10);
      const add10and5 = add10(5);

      expect(add10and5(3)).toBe(18);
      expect(add10and5(7)).toBe(22);
    });

    it("should work with string concatenation", () => {
      const concat3 = (a: string, b: string, c: string) => a + b + c;
      const curriedConcat = curry3(concat3);

      expect(curriedConcat("Hello")(" ")("World")).toBe("Hello World");
    });
  });

  describe("identity", () => {
    it("should return input unchanged for numbers", () => {
      expect(identity(5)).toBe(5);
      expect(identity(0)).toBe(0);
      expect(identity(-10)).toBe(-10);
    });

    it("should return input unchanged for strings", () => {
      expect(identity("hello")).toBe("hello");
      expect(identity("")).toBe("");
    });

    it("should return input unchanged for objects", () => {
      const obj = { a: 1, b: 2 };
      expect(identity(obj)).toBe(obj);
    });

    it("should work with map", () => {
      const arr = [1, 2, 3, 4, 5];
      expect(arr.map(identity)).toEqual([1, 2, 3, 4, 5]);
    });

    it("should work in pipe as no-op", () => {
      const result = pipe(5, identity, (x) => x * 2, identity);
      expect(result).toBe(10);
    });
  });

  describe("constant", () => {
    it("should return a function that always returns the given value", () => {
      const alwaysTrue = constant(true);
      expect(alwaysTrue()).toBe(true);
      expect(alwaysTrue()).toBe(true);
    });

    it("should work with numbers", () => {
      const always42 = constant(42);
      expect(always42()).toBe(42);
    });

    it("should work with strings", () => {
      const alwaysHello = constant("hello");
      expect(alwaysHello()).toBe("hello");
    });

    it("should work with objects", () => {
      const obj = { a: 1 };
      const alwaysObj = constant(obj);
      expect(alwaysObj()).toBe(obj);
    });

    it("should work with map to create constant array", () => {
      const arr = [1, 2, 3];
      expect(arr.map(constant(42))).toEqual([42, 42, 42]);
    });

    it("should create independent constant functions", () => {
      const always5 = constant(5);
      const always10 = constant(10);

      expect(always5()).toBe(5);
      expect(always10()).toBe(10);
    });
  });
});
