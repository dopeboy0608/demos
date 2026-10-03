/**
 * 빌드 base(`/demos/`)를 TanStack Router basepath 형식으로 바꾼다.
 * 라우터는 끝 슬래시가 없는 `/demos`를 기대하고, 루트 배포는 `/`여야 한다.
 */
export function toRouterBasepath(base: string): string {
  const segments = base.split('/').filter(Boolean);
  return `/${segments.join('/')}`;
}
