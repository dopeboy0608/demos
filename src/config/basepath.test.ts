import { describe, expect, it } from 'vitest';

import { joinAssetPath, toRouterBasepath } from './basepath';

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

describe('joinAssetPath', () => {
  it.each([
    ['/', '/roboking/img/event.png', '/roboking/img/event.png'],
    ['/demos/', '/roboking/img/event.png', '/demos/roboking/img/event.png'],
    ['/demos', '/roboking/img/event.png', '/demos/roboking/img/event.png'],
    ['', '/roboking/img/event.png', '/roboking/img/event.png'],
  ])('base %j + path %j → %j', (base, path, expected) => {
    expect(joinAssetPath(base, path)).toBe(expected);
  });
});
