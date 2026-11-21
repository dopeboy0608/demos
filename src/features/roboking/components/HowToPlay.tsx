import { Typography } from 'antd';

const { Title, Paragraph } = Typography;

export function HowToPlay() {
  return (
    <section className="roboking-panel">
      <Title level={4} className="roboking-panel-title">
        HOW TO PLAY
      </Title>
      <Paragraph className="roboking-howto-text">
        화살표 키로 로봇을 움직여 방 안의 먼지를 모두 흡입하세요.
        <br />
        스페이스바로 스피드업 아이템을 사용할 수 있습니다.
        <br />
        제한 시간 안에 먼지를 모두 치우면 다음 방으로 이동합니다.
      </Paragraph>
    </section>
  );
}
