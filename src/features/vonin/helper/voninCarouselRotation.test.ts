import { describe, expect, it } from 'vitest';

import { rotateCarousel } from './voninCarouselRotation';

describe('rotateCarousel', () => {
  const items = [1, 2, 3, 4, 5];

  it('양수 steps만큼 앞을 뒤로 보낸다', () => {
    expect(rotateCarousel(items, 1)).toEqual([2, 3, 4, 5, 1]);
    expect(rotateCarousel(items, 2)).toEqual([3, 4, 5, 1, 2]);
  });

  it('음수 steps는 반대 방향으로 순환한다', () => {
    expect(rotateCarousel(items, -1)).toEqual([5, 1, 2, 3, 4]);
  });

  it('배열 길이와 같은 steps는 원래 순서로 돌아온다', () => {
    expect(rotateCarousel(items, 5)).toEqual(items);
  });

  it('빈 배열은 빈 배열을 반환한다', () => {
    expect(rotateCarousel([], 3)).toEqual([]);
  });
});
