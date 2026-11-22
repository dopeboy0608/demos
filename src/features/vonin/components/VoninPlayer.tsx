import { useState } from 'react';

// Player.as/MoviePlay.as 그대로: play/pause 토글 버튼. ffmpeg 미설치로 실제 FLV→MP4 변환이
// 불가능해 영상 재생은 범위 밖(결정 사항 참고) — 버튼 UI와 토글 상태만 구현.
export function VoninPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="vonin-player">
      <div className="vonin-player-screen" />
      <button
        type="button"
        className="vonin-player-btn"
        onClick={() => setIsPlaying((prev) => !prev)}
      >
        {isPlaying ? '❚❚' : '▶'}
      </button>
    </div>
  );
}
