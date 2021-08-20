# `object-diff-patch` [![npm](https://img.shields.io/npm/v/object-diff-patch.svg)](https://www.npmjs.org/package/object-diff-patch)

Calculates the difference between two objects/arrays/primitives.
The resulting patch object is a subset of the source object's structure.

Patches can be applied to objects to morph them into the result.

You can use this library to synchronize objects between threads without transfering the whole object every sync.

## Example

```js
import { diff, apply } from 'object-diff-patch';

// our initial record:
let person = {
	name: 'Robert',
	aliases: ['Rob', 'Bob']
};

// a new version of the record:
let newPerson = {
	firstName: 'Robert',
	lastName: 'Loblaw',
	aliases: ['Rob', 'Bob', 'Bobby']
};

// Calculate the differences between the first and second version:
let patch = diff(person, newPerson);
// {
//   name: undefined,
//   firstName: 'Robert',
//   lastName: 'Loblaw',
//   aliases: { 2: 'Bobby' }
// }

// Apply the patch to the first version:
person = apply(person, patch);

// Now they're the same:
JSON.stringify(person) === JSON.stringify(newPerson); // true
```

## Threaded Example

The following example shows how to use `object-diff-patch` to
send deltas/patches back from a Worker thread instead of whole new objects.

**index.js:**

```js
import { wrap } from 'comlink';
import { apply } from 'object-diff-patch/apply';

const worker = wrap(new Worker('./worker.js', { type: 'module' }));

const CACHE = new Map();

export async function getThing(name) {
	// grab the previous object from our cache:
	let obj = CACHE.get(name);

	// get only the patch/delta object from the worker:
	const patch = await worker.getThing(name);

	// morph the previous object into the new one:
	obj = apply(obj, patch);

	// cache the new result (so we can repeat this again)
	CACHE.set(name, obj);
	return obj;
}
```

**worker.js:**

```js
import { expose } from 'comlink';
import { diff } from 'object-diff-patch/diff';

const CACHE = new Map();

async function getThing(name) {
	const res = await fetch(`/things/${name}`);
	const thing = await res.json();

	const old = CACHE.get(name); // note: can be undefined!

	// generate the patch object (the delta from the previous cached result):
	const patch = diff(thing, old);

	// store for next call (so we can repeat this again)
	CACHE.set(name, thing);

	// pass only the patch/delta to the main thread
	return patch;
}

expose({ getThing });
```

## License

Apache-2.0
