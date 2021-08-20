/**
 * Use this to create a "patch" object in the worker thread.
 * @template {any} T
 * @template {any} U
 * @param {T} obj
 * @param {U} old
 * @returns {T | (Partial<T> | Partial<U>) | undefined}
 * @example
 * 	patch = diff(newObject, oldObject);
 */
export function diff(obj, old) {
	if (typeof obj === 'object') {
		const isArray = Array.isArray(obj);

		if (!old || typeof old !== 'object' || isArray !== Array.isArray(old)) {
			return obj;
		}

		if (isArray) {
			let out;
			let i = 0;
			const max = Math.min(obj.length, old.length);
			for (; i < max; i++) {
				const differs = different(obj[i], old[i]);
				if (differs) break;
			}
			// for previously-empty arrays, hint at newness by using an Array
			const useArray = old.length === 0;
			const offset = obj.length - old.length;
			for (let j = obj.length; j-- > i; ) {
				const oldJ = j - offset;
				if (oldJ >= 0) {
					const differs = different(obj[j], old[oldJ]);
					if (differs) {
						if (!out) out = useArray ? [] : {};
						out[j] = diff(obj[j], old[oldJ]);
					}
				} else {
					if (!out) out = useArray ? [] : {};
					out[j] = obj[j];
				}
			}
			return out;
		}

		let out;
		for (let key in obj) {
			if (!(key in old) || obj[key] !== old[key]) {
				if (!out) out = {};
				// `undefined` means removed, missing means unchanged.
				const r = diff(obj[key], old[key]);
				if (r !== undefined) {
					out[key] = r;
				}
			}
		}
		for (let key in old) {
			if (obj == null || !(key in obj)) {
				if (!out) out = {};
				// `undefined` means removed, missing means unchanged.
				out[key] = undefined;
			}
		}
		return out;
	} else if (obj != old) {
		return obj;
	}
}

function different(obj, old) {
	for (let key in obj) {
		if (old == null || !(key in old) || obj[key] !== old[key]) {
			return true;
		}
	}
	for (let key in old) {
		if (obj == null || !(key in obj)) {
			return true;
		}
	}
	return false;
}
