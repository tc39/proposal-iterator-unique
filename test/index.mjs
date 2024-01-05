import { test } from 'node:test';
import * as assert from 'node:assert/strict';
import '../lib/index.js';

test('distinct', async t => {
  let a = {}, b ={}, c = Symbol(), d = Symbol.for('test'), e = Symbol.iterator, f = () => {}, g = 0, h = -0, i = 1;
  assert.deepEqual(
    Array.from([a, a, b, b, c, c, d, d, e, e, f, f, g, g, h, h, i, i].values().distinct()),
    [a, b, c, d, e, f, g, h, i],
  );
  assert.deepEqual(
    Array.from([a, b, c, d, e, f, g, h, i, a, b, c, d, e, f, g, h, i].values().distinct()),
    [a, b, c, d, e, f, g, h, i],
  );

  let states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
  assert.deepEqual(
    Array.from(states.values().distinct(s => s[0])),
    ['Alabama', 'California', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Kansas', 'Louisiana', 'Maine', 'Nebraska', 'Ohio', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'Tennessee', 'Utah', 'Vermont', 'Washington'],
  );

  assert.throws(() => {
    [].values().distinct({});
  }, TypeError)
  assert.throws(() => {
    [].values().distinct(null);
  }, TypeError)
  assert.throws(() => {
    [].values().distinct(0);
  }, TypeError)
});
