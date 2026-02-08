/**
 * Functional programming utility helpers
 */

/**
 * Pipe function for left-to-right composition
 * Applies functions sequentially from left to right
 *
 * @example
 * const result = pipe(
 *   5,
 *   (x) => x * 2,
 *   (x) => x + 1,
 *   (x) => x.toString()
 * ); // "11"
 */
export function pipe<A>(value: A): A;
export function pipe<A, B>(value: A, fn1: (a: A) => B): B;
export function pipe<A, B, C>(value: A, fn1: (a: A) => B, fn2: (b: B) => C): C;
export function pipe<A, B, C, D>(
  value: A,
  fn1: (a: A) => B,
  fn2: (b: B) => C,
  fn3: (c: C) => D,
): D;
export function pipe<A, B, C, D, E>(
  value: A,
  fn1: (a: A) => B,
  fn2: (b: B) => C,
  fn3: (c: C) => D,
  fn4: (d: D) => E,
): E;
export function pipe<A, B, C, D, E, F>(
  value: A,
  fn1: (a: A) => B,
  fn2: (b: B) => C,
  fn3: (c: C) => D,
  fn4: (d: D) => E,
  fn5: (e: E) => F,
): F;
export function pipe<A, B, C, D, E, F, G>(
  value: A,
  fn1: (a: A) => B,
  fn2: (b: B) => C,
  fn3: (c: C) => D,
  fn4: (d: D) => E,
  fn5: (e: E) => F,
  fn6: (f: F) => G,
): G;
export function pipe<A, B, C, D, E, F, G, H>(
  value: A,
  fn1: (a: A) => B,
  fn2: (b: B) => C,
  fn3: (c: C) => D,
  fn4: (d: D) => E,
  fn5: (e: E) => F,
  fn6: (f: F) => G,
  fn7: (g: G) => H,
): H;
export function pipe<A, B, C, D, E, F, G, H, I>(
  value: A,
  fn1: (a: A) => B,
  fn2: (b: B) => C,
  fn3: (c: C) => D,
  fn4: (d: D) => E,
  fn5: (e: E) => F,
  fn6: (f: F) => G,
  fn7: (g: G) => H,
  fn8: (h: H) => I,
): I;
export function pipe(value: any, ...fns: Array<(x: any) => any>): any {
  return fns.reduce((acc, fn) => fn(acc), value);
}

/**
 * Compose function for right-to-left composition
 * Applies functions sequentially from right to left
 *
 * @example
 * const addThenMultiply = compose(
 *   (x: number) => x * 2,
 *   (x: number) => x + 1
 * );
 * addThenMultiply(5); // 12 (first adds 1, then multiplies by 2)
 */
export const compose =
  <T>(...fns: Array<(x: T) => T>): ((x: T) => T) =>
  (initial: T) =>
    fns.reduceRight((acc, fn) => fn(acc), initial);

/**
 * Curry a function with 2 parameters
 *
 * @example
 * const add = (a: number, b: number) => a + b;
 * const curriedAdd = curry2(add);
 * const add5 = curriedAdd(5);
 * add5(3); // 8
 */
export const curry2 =
  <A, B, R>(fn: (a: A, b: B) => R): ((a: A) => (b: B) => R) =>
  (a: A) =>
  (b: B) =>
    fn(a, b);

/**
 * Curry a function with 3 parameters
 *
 * @example
 * const sum3 = (a: number, b: number, c: number) => a + b + c;
 * const curriedSum = curry3(sum3);
 * const add5and3 = curriedSum(5)(3);
 * add5and3(2); // 10
 */
export const curry3 =
  <A, B, C, R>(fn: (a: A, b: B, c: C) => R): ((a: A) => (b: B) => (c: C) => R) =>
  (a: A) =>
  (b: B) =>
  (c: C) =>
    fn(a, b, c);

/**
 * Identity function - returns its input unchanged
 * Useful for functional composition and as a default callback
 *
 * @example
 * identity(5); // 5
 * [1, 2, 3].map(identity); // [1, 2, 3]
 */
export const identity = <T>(x: T): T => x;

/**
 * Constant function - returns a function that always returns the given value
 * Useful for creating constant functions in functional pipelines
 *
 * @example
 * const alwaysTrue = constant(true);
 * alwaysTrue(); // true
 * [1, 2, 3].map(constant(42)); // [42, 42, 42]
 */
export const constant =
  <T>(value: T): (() => T) =>
  () =>
    value;
