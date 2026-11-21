import type { ReactNode } from 'react';
import { useKakaoLoader } from 'react-kakao-maps-sdk';

interface RegionViewMapGuardProps {
  children: ReactNode;
}

export function RegionViewMapGuard({ children }: RegionViewMapGuardProps) {
  const apiKey = import.meta.env.PUBLIC_KAKAO_MAP_API_KEY;
  const [loading, error] = useKakaoLoader({
    appkey: apiKey ?? '',
    libraries: ['drawing'],
  });

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
