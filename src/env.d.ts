/// <reference types="kakao.maps.d.ts" />

/**
 * Imports the SVG file as a React component.
 * @requires [@rsbuild/plugin-svgr](https://npmjs.com/package/@rsbuild/plugin-svgr)
 */
declare module '*.svg?react' {
  import type { FunctionComponent, SVGProps } from 'react';
  const ReactComponent: FunctionComponent<SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}

interface ImportMetaEnv {
  readonly PUBLIC_KAKAO_MAP_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// rsbuild.config.ts의 source.define으로 주입되는 빌드 base 경로
declare const __BASE_PATH__: string;
