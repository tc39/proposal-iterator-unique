const IteratorPrototype = Object.getPrototypeOf(Object.getPrototypeOf([].values()))

function isObject(obj: unknown): obj is Object {
  return Object(obj) === obj;
}

function isZero(obj: unknown): obj is 0 | -0 {
  return obj === 0;
}

function liftIterator<A>(iter: Iterator<A>): Iterable<A> {
  return { [Symbol.iterator]() { return iter; } };
}

function* distinctImpl<A>(iter: Iterator<A>, mapper?: (elem: unknown) => unknown): Generator<A> {
  let objSeen = new WeakSet,
    primSeen = new Set,
    seenNegZero = false;
  for (const elem of liftIterator(iter)) {
    let test = mapper === undefined ? elem : mapper(elem);
    if (isZero(test) && 1/test < 0) {
      if (!seenNegZero) {
        seenNegZero = true;
        yield elem;
      }
    } else if (isObject(test)) {
      if (!objSeen.has(test)) {
        objSeen.add(test);
        yield elem;
      }
    } else {
      if (!primSeen.has(test)) {
        primSeen.add(test);
        yield elem;
      }
    }
  }
}

function distinct<A>(this: Iterator<A>, mapper?: (elem: A) => unknown): Generator<A>
function distinct(this: unknown, mapper?: unknown): Generator<unknown> {
  if (typeof mapper !== 'function' && mapper !== undefined) {
    throw new TypeError;
  }
  return distinctImpl(this as Iterator<unknown>, mapper as any);
}

Object.defineProperty(IteratorPrototype, 'distinct', {
  configurable: true,
  writable: true,
  enumerable: false,
  value: distinct,
});
