Iterator Unique
===============

A TC39 proposal to produce an iterator of unique values from any iterator.

**Stage:** 1

See the [January 2024 presentation to committee](https://docs.google.com/presentation/d/1381O5-rNH72MheHOIiTDfzentOn4APPps3R2MYeLzWY/edit).

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
1. Can't yield both 0 and -0.
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

```js
let uniques = iter
  .map(e => [e, f(e)])
  .filter([, criteria] => { ... })
  .map(([e]) => e);
```

## chosen solution

`Iterator.prototype.uniqBy` which takes an optional mapper.

```js
let uniques = iter.uniqBy();
let uniques = iter.uniqBy(obj => obj.field);
```

## design space

* still no good solution for composite keys, but that's an unsolved problem generally
* mapper? comparator? both? neither?
  * separate methods or combined with optional params?
  * would mapper be passed an index?
* naming: `distinct` is also common

## prior art

### other languages

| language | library | simple API | with comparator | with mapping |
|----------|---------|------------|-----------------|--------------|
| Clojure | core | `distinct` | -- | -- |
| Elm | List.Extra | `unique` | -- | `uniqueBy` |
| Haskell | Data.List | `nub` | `nubBy` | -- |
| Java | Stream | `distinct` | -- | -- |
| Kotlin | Sequence | `distinct` | -- | `distinctBy` |
| .NET | System.Linq | `Distinct` | `Distinct`, `DistinctBy` | `DistinctBy` | 
| PHP | array | `array_unique` | -- | -- |
| Python | more-itertools | `unique_everseen` | -- | `unique_everseen` |
| Ruby | Enumerable | `uniq` | -- | `uniq` |
| Rust | Iterator | -- | -- | -- |
| Scala | Seq | `distinct` | -- | `distinctBy` |
| Shell | GNU coreutils | `uniq` | -- | -- |
| Swift | Sequence | -- | -- | -- |

### JS libraries

| library | simple API | with comparator | with mapping |
|---------|------------|-----------------|--------------|
| `extra-iterable` | `unique` | `unique` | `unique` |
| `iter-ops` | `distinct` | -- | `distinct` |
| `iter-tools` | `distinct` | -- | `distinct` |
| `itertools-ts` |  `distinct` | -- | `distinct` |
| Lodash / Underscore | `uniq` | `uniqWith` | `uniqBy` |
| Ramda | `uniq` | `uniqWith` | `uniqBy` |
| sequency | `distinct` | -- | `distinctBy` |
| wu | `unique` | -- | -- |
