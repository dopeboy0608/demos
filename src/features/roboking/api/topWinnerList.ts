import type { TopWinnerList } from '../helper/types';

// 원본 mock(php/topWinnerList.php) 응답을 정적 JSON으로 옮긴 값.
export const topWinnerList: TopWinnerList = {
  top: Array.from({ length: 10 }, (_, i) => ({
    thumb: '/roboking/img/top_thumb.png',
    id: `test${String(i).padStart(3, '0')}`,
    score: 399949,
  })),
  hombotWinner: {
    thumb: '/roboking/img/winner_thumb.png',
    id: 'test0',
  },
  prizeWinner: Array.from({ length: 13 }, (_, i) => ({
    thumb: '/roboking/img/winner_thumb.png',
    id: `test${i + 1}`,
    date: '2012.10.25',
  })),
};
