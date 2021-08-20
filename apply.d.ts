/**
 * Use this to apply diffs on the main thread.
 * @example
 * 	newObject = apply(oldObject, patch);
 */
export function apply<T, U>(obj: T, diff: U): T extends any[] ? T : T & U
