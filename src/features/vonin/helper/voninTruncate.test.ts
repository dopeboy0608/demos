import { describe, expect, it } from 'vitest';

import { truncateText } from './voninTruncate';

describe('truncateText', () => {
  it('제한 길이를 넘으면 자르고 말줄임 기호를 붙인다', () => {
    expect(truncateText('1234567890', 5)).toBe('12345...');
  });

  it('제한 길이 이하면 원문 그대로 반환한다', () => {
    expect(truncateText('짧은글', 16)).toBe('짧은글');
  });

  it('정확히 제한 길이와 같으면 자르지 않는다', () => {
    expect(truncateText('12345', 5)).toBe('12345');
  });

  it('말줄임 기호를 다르게 지정할 수 있다(Rss/Qa는 ".."을 사용)', () => {
    expect(truncateText('1234567890', 5, '..')).toBe('12345..');
  });
});
