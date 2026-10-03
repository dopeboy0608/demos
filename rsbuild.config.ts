import path from 'node:path';
import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginTailwindcss } from '@rsbuild/plugin-tailwindcss';

// GitHub Pages 프로젝트 페이지 서브경로 배포 대응 (예: /demos/). 로컬/커스텀 도메인 배포는 '/'.
const basePath = process.env.GH_PAGES_BASE_PATH || '/';

// Docs: https://rsbuild.rs/config/
export default defineConfig({
  plugins: [pluginReact(), pluginTailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  output: {
    assetPrefix: basePath,
  },
  server: {
    base: basePath,
  },
});
