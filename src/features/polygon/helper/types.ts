export interface LatLng {
  lat: number;
  lng: number;
}

/** 결과 폴리곤을 클릭했을 때의 처리 방식 */
export type PolygonClickMode = 'none' | 'edit' | 'select';

/** 결과 영역에 표시되는 폴리곤 그룹 — 그룹별로 생성 방식이 다르다 */
export type ResultGroup = 'basic' | 'split' | 'punch' | 'merge';
