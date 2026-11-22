import { toAssetUrl } from '@/config/basepath';

import type { FriendsList } from '../helper/types';

// 원본 mock(php/friendsList.php) 응답을 정적 JSON으로 옮긴 값.
// key19는 원본 mock 파일에도 없다(18 다음 20으로 건너뜀) — 그대로 재현한다.
const FRIEND_KEYS = [
  ...Array.from({ length: 18 }, (_, i) => i + 1),
  ...Array.from({ length: 7 }, (_, i) => i + 20),
];

export const friendsList: FriendsList = {
  myphoto: toAssetUrl('/roboking/img/big.png'),
  friend: FRIEND_KEYS.map((key) => ({
    bigThumb: toAssetUrl('/roboking/img/big.png'),
    smallThumb: toAssetUrl('/roboking/img/small.png'),
    id: `test${key}`,
    key,
  })),
};
