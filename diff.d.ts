type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

/**
 * Use this to create a "patch" object in the worker thread.
 * @example
 * 	patch = diff(newObject, oldObject);
 */
export function diff<T, U>(obj: T, old: U): DeepPartial<T & U>;
