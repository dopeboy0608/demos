interface KakaoLatLngLike {
  getLng: () => number;
  getLat: () => number;
}

interface KakaoBoundsLike {
  getNorthEast: () => KakaoLatLngLike;
  getSouthWest: () => KakaoLatLngLike;
}

// 백엔드 API는 [lng, lat] 순서를 기대한다.
export function boundsToRectangle(bounds: KakaoBoundsLike): [number, number][] {
  const ne = bounds.getNorthEast();
  const sw = bounds.getSouthWest();
  const east = ne.getLng();
  const north = ne.getLat();
  const west = sw.getLng();
  const south = sw.getLat();

  return [
    [east, north],
    [east, south],
    [west, south],
    [west, north],
    [east, north],
  ];
}

export function getTolerance(zoomLevel: number): number {
  if (zoomLevel < 4) return 0;
  return 0.00007 * 2 ** (zoomLevel - 5);
}
