import type { RegisterResponse } from '../helper/types';

export interface RegisterRequest {
  id: string;
  key: string;
  totalScore: number;
}

/**
 * 원본 mock(php/register.php)은 URL-encoded로 `result=ok&msg=&win=false&totalScore=10000`을
 * 항상 반환한다. 데모에서 당첨 분기를 확인할 수 있도록 `?forceWin=true` 쿼리 파라미터가 있으면
 * `win=true`로 응답한다(FR-20, 실 서버 검증 없음 — 결정 사항 참고).
 */
export function registerScore(
  request: RegisterRequest,
): Promise<RegisterResponse> {
  const forceWin =
    new URLSearchParams(window.location.search).get('forceWin') === 'true';

  return Promise.resolve({
    result: 'ok',
    win: forceWin,
    totalScore: request.totalScore,
  });
}
