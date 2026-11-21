import { describe, expect, it } from 'vitest';

import { createDeliveryDateOptions } from './deliveryDateOptions';

describe('createDeliveryDateOptions', () => {
  it('컷오프 시간 이전이면 오늘부터 옵션을 생성한다', () => {
    const now = new Date(2026, 0, 1, 10, 0);
    const options = createDeliveryDateOptions(now, 3, 15);

    expect(options[0]).toEqual({
      label: '2026-01-01 (목)',
      value: '2026-01-01',
    });
    expect(options).toHaveLength(4);
  });

  it('컷오프 시간 이후면 내일부터 옵션을 생성한다', () => {
    const now = new Date(2026, 0, 1, 16, 0);
    const options = createDeliveryDateOptions(now, 3, 15);

    expect(options[0]).toEqual({
      label: '2026-01-02 (금)',
      value: '2026-01-02',
    });
  });

  it('days+1개의 연속된 날짜 옵션을 생성한다', () => {
    const now = new Date(2026, 0, 30, 9, 0);
    const options = createDeliveryDateOptions(now, 3, 15);

    expect(options.map((option) => option.value)).toEqual([
      '2026-01-30',
      '2026-01-31',
      '2026-02-01',
      '2026-02-02',
    ]);
  });
});
