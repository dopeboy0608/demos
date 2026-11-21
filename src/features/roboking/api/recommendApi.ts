import type { RecommendResponse } from '../helper/types';

export interface RecommendRequest {
  name: string;
  email: string;
  friendKeys: number[];
}

/** 원본 mock(php/recommend.php)은 `result=ok&msg=`를 항상 반환한다. 실 전송/이미지 합성 없음. */
export function submitRecommend(
  _request: RecommendRequest,
): Promise<RecommendResponse> {
  return Promise.resolve({ result: 'ok' });
}
