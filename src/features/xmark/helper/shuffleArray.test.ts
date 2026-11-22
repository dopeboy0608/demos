import { describe, expect, it } from 'vitest';

import { shuffleArray } from './shuffleArray';

describe('shuffleArray', () => {
  it('원본 배열을 변경하지 않는다', () => {
    const items = [1, 2, 3, 4, 5];
    shuffleArray(items);
    expect(items).toEqual([1, 2, 3, 4, 5]);
  });

  it('같은 개수·같은 원소 집합을 유지한다', () => {
    const items = [1, 2, 3, 4, 5];
    const result = shuffleArray(items);
    expect(result).toHaveLength(5);
    expect([...result].sort()).toEqual([1, 2, 3, 4, 5]);
  });

  it('고정된 random 함수로는 결정적인 순서를 만든다(피셔-예이츠)', () => {
    const items = [1, 2, 3, 4];
    const result = shuffleArray(items, () => 0);
    // random()이 항상 0이면 매 스텝에서 j=0이 되어 마지막 원소부터 앞으로 하나씩 보내는 순서가 된다.
    expect(result).toEqual([2, 3, 4, 1]);
  });
});
