import type { ReactNode } from 'react';
import { useKakaoLoader } from 'react-kakao-maps-sdk';

interface PolygonMapGuardProps {
  children: ReactNode;
}

export function PolygonMapGuard({ children }: PolygonMapGuardProps) {
  const apiKey = import.meta.env.PUBLIC_KAKAO_MAP_API_KEY;
  // apiKey가 없어도 훅은 항상 호출해야 하므로(Rules of Hooks) 빈 문자열을 넘기고,
  // 실제 로딩 성공 여부와 무관하게 아래 apiKey 체크에서 먼저 안내 메시지로 분기한다.
  const [loading, error] = useKakaoLoader({ appkey: apiKey ?? '' });

  if (!apiKey) {
    return (
      <div role="alert">
        카카오맵 API 키(PUBLIC_KAKAO_MAP_API_KEY)가 설정되지 않았습니다.
        .env.local에 키를 입력한 뒤 다시 시도해주세요.
      </div>
    );
  }

  if (error) {
    return (
      <div role="alert">
        카카오맵 SDK 로딩에 실패했습니다. API 키를 확인해주세요.
      </div>
    );
  }

  if (loading) {
    return <div>지도를 불러오는 중...</div>;
  }

  return <>{children}</>;
}
