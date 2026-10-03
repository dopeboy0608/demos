import { describe, expect, it } from 'vitest';

import { toRouterBasepath } from './basepath';

describe('toRouterBasepath', () => {
  it.each([
    ['/', '/'],
    ['/demos/', '/demos'],
    ['/demos', '/demos'],
    ['', '/'],
    ['demos/', '/demos'],
    ['//demos//', '/demos'],
  ])('%j → %j', (base, expected) => {
    expect(toRouterBasepath(base)).toBe(expected);
  });
});
