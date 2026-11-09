import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {performance} from 'node:perf_hooks';
import {validateWorkspace, renderWorkspace} from '../scripts/build.mjs';

const workspace = JSON.parse(await readFile(new URL('../workspace.json', import.meta.url), 'utf8'));

test('Performance benchmark over 10,000 iterations', () => {
  const iterations = 10000;

  let start = performance.now();
  for (let i = 0; i < iterations; i++) {
    validateWorkspace(workspace);
  }
  const validateTime = performance.now() - start;

  start = performance.now();
  for (let i = 0; i < iterations; i++) {
    renderWorkspace(workspace);
  }
  const renderTime = performance.now() - start;

  console.log(`validateWorkspace x${iterations}: ${validateTime.toFixed(2)}ms`);
  console.log(`renderWorkspace x${iterations}: ${renderTime.toFixed(2)}ms`);

  assert.ok(validateTime < 500, `validateWorkspace should be fast (took ${validateTime.toFixed(2)}ms)`);
  assert.ok(renderTime < 500, `renderWorkspace should be fast (took ${renderTime.toFixed(2)}ms)`);
});
