import { Map as KakaoMap } from 'react-kakao-maps-sdk';

import { CITY_HALL, DEFAULT_MAP_ZOOM_LEVEL } from '../helper/constants';

export function RegionViewMap() {
  return (
    <KakaoMap
      center={CITY_HALL}
      level={DEFAULT_MAP_ZOOM_LEVEL}
      maxLevel={12}
      style={{ width: '100%', height: '100%' }}
    />
  );
}
