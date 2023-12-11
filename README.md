Iterator Unique
===============

A TC39 proposal to produce an iterator of unique values from any iterator.

**Stage:** 0

## motivation

Removing duplicates from any kind of collection is a common operation. It's not very easy to do for iterators.

For some iterables, you can do something like the following:

```js
let uniques = new Set(iter).values();
```

This has a few downsides, though:

1. Consumes the whole iterator before producing any results.
1. Doesn't work for infinite iterators.
1. Yields 0 when the underlying iterator yields -0.
1. Can't yeild both 0 and -0.
1. Doesn't work for non-iterable iterators.

A better solution is much harder to write and doesn't work well with chaining, as it requires a bunch of side variables for state.

```js
let objSeen = new WeakSet,
  primSeen = new Set,
  seenNegZero = false;

let uniques = iter.filter(e => {
  if (e === 0 && 1/e < 0) {
    if (seenNegZero) return false;
    seenNegZero = true;
    return true;
  }
  let seen = Object(e) === e ? objSeen : primSeen;
  if (seen.has(e)) return false;
  seen.add(e);
  return true;
});
```

Worse, when you want to unique by some applied transform, you need to surround the `filter` with tupling and untupling `map`s.

## chosen solution

`Iterator.prototype.uniqBy` which takes an optional mapper.

```js
let uniques = iter.uniqBy();
let uniques = iter.uniqBy(obj => obj.field);
```

## design space

* still no good solution for compound keys, but that's an unsolved problem generally

## prior art

### other languages

TODO

### JS libraries

TODO
