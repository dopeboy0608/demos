import { createRoute, Link } from '@tanstack/react-router';
import { Card, Typography } from 'antd';

import { rootRoute } from './__root';

const { Title, Paragraph } = Typography;

const DEMOS = [
  {
    to: '/polygon' as const,
    title: '폴리곤 제어 데모',
    description:
      '지도 2개에서 폴리곤을 그리고 선택·합치기(union/intersection/xor/difference)·분할하는 데모 화면',
  },
];

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => (
    <div>
      <Title level={2}>데모 목록</Title>
      <Paragraph type="secondary">
        아래 카드를 눌러 데모를 실행해보세요.
      </Paragraph>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
        {DEMOS.map((demo) => (
          <Link key={demo.to} to={demo.to} style={{ display: 'block' }}>
            <Card hoverable title={demo.title} style={{ width: 280 }}>
              <Paragraph style={{ marginBottom: 0 }}>
                {demo.description}
              </Paragraph>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  ),
});
