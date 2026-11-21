import { Typography } from 'antd';
import YouTube from 'react-youtube';

const { Title } = Typography;

// 원본 Flash가 자체 chromeless YouTube 플레이어로 재생하던 영상 ID.
const VIDEO_ID = 'aEzpcuc83BM';

export function GameVideo() {
  return (
    <section className="roboking-panel">
      <Title level={4} className="roboking-panel-title">
        WATCH VIDEO
      </Title>
      <div className="roboking-video-wrapper">
        <YouTube
          videoId={VIDEO_ID}
          opts={{ width: '100%', height: '100%' }}
          className="roboking-video"
        />
      </div>
    </section>
  );
}
