/**
 * Use this to apply diffs on the main thread.
 * @template {any} T
 * @template {any} U
 * @param {T} obj
 * @param {U} diff
 * @returns {(T extends any[] ? T : { [K: keyof (U|T)]: (U|T)[K] }) | T | U | undefined} diff
 * @example
 * 	newObject = apply(oldObject, patch);
 */
export function apply(obj, diff) {
	if (typeof obj !== typeof diff) {
		return diff;
	}

	if (typeof diff === 'object') {
		if (Array.isArray(diff)) {
			return diff;
		}

		let out = obj;
		if (Array.isArray(obj)) {
			for (let i in diff) {
				out[i] = apply(obj[i], diff[i]);
			}
		} else {
			for (let i in diff) {
				out[i] = apply(obj[i], diff[i]);
			}
		}

		return out;
	}
	return diff;
}
