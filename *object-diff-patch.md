# `object-diff-patch`

```js
// on the main thread
import { apply } from 'object-diff-patch/apply';

import createWorker from 'workerize-loader!./worker.js';
const worker = createWorker();

const CACHE = new Map();

export async function getThing(name) {
  let obj = CACHE.get(name);
  
  const patch = await worker.getThing(name);
  
  obj = apply(obj, patch); // turn the old object into the new one
  
  CACHE.set(name, obj); // cache so we can apply patches later
  return obj;
}
```

```js
// worker.js
import { diff } from 'object-diff-patch/diff';

const CACHE = new Map();

export async function getThing(name) {
  const res = await fetch(`/things/${name}`);
  const thing = await res.json();
  
  const old = CACHE.get(name);  // can be null/undefined
  
  const patch = diff(thing, old); // generate the delta object
  
  CACHE.set(name, thing); // store for next call
  
  return patch; // pass only the patch/delta to the main thread
}
```