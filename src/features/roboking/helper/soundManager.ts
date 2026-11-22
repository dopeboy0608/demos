import { toAssetUrl } from '@/config/basepath';

// stage_kitchen.fla(XFL)의 LIBRARY/sound에서 실제로 추출한 효과음.
// Howler.js 같은 라이브러리 없이도 네이티브 Audio로 충분해 추가하지 않았다.
const SOUND_SOURCES = {
  oops: toAssetUrl('/roboking/sound/oops.wav'),
  itemGet: toAssetUrl('/roboking/sound/item-get.mp3'),
} as const;

export type SoundKey = keyof typeof SOUND_SOURCES;

export function playSound(key: SoundKey) {
  const audio = new Audio(SOUND_SOURCES[key]);
  // 브라우저 자동재생 정책으로 play()가 거부될 수 있으나, 효과음 재생 실패는
  // 게임 진행에 영향이 없으므로 조용히 무시한다.
  audio.play().catch(() => {});
}
