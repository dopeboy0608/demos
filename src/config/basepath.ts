/**
 * 빌드 base(`/demos/`)를 TanStack Router basepath 형식으로 바꾼다.
 * 라우터는 끝 슬래시가 없는 `/demos`를 기대하고, 루트 배포는 `/`여야 한다.
 */
export function toRouterBasepath(base: string): string {
  const segments = base.split('/').filter(Boolean);
  return `/${segments.join('/')}`;
}

/**
 * `public/` 하위 정적 자산을 가리키는 절대 경로("/vonin/img/...")는 빌드 base를 모르므로,
 * GitHub Pages 서브경로(`/demos/`)에 배포하면 도메인 루트 기준으로 풀려 깨진다. 배포 base를
 * 앞에 붙여 실제 서빙 경로로 바꾼다.
 */
export function joinAssetPath(base: string, path: string): string {
  const prefix = toRouterBasepath(base);
  return prefix === '/' ? path : `${prefix}${path}`;
}

export function toAssetUrl(path: string): string {
  return joinAssetPath(__BASE_PATH__, path);
}
