import { BorderOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { createRoute, Link } from '@tanstack/react-router';
import { Card, Tag, Typography } from 'antd';
import type { CSSProperties, ReactNode } from 'react';

import { toAssetUrl } from '@/config/basepath';

import { rootRoute } from './__root';

const { Title, Paragraph } = Typography;

const COVER_HEIGHT = 140;

const iconCoverStyle = (background: string): CSSProperties => ({
  height: COVER_HEIGHT,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background,
  fontSize: 48,
});

const imageCoverStyle: CSSProperties = {
  height: COVER_HEIGHT,
  width: '100%',
  objectFit: 'cover',
};

interface Demo {
  to: '/polygon' | '/roboking' | '/region-view' | '/xmark';
  title: string;
  description: string;
  /** 진행 상태 배지(예: 복원 진행중). 없으면 표시하지 않는다. */
  status?: string;
  cover: ReactNode;
}

// GNB 메뉴 순서(폴리곤 제어 → 권역조회 → X-MARK → LG 로보킹)와 동일하게 맞춘다(#83).
const DEMOS: Demo[] = [
  {
    to: '/polygon',
    title: '폴리곤 제어',
    description:
      '지도 2개에서 폴리곤을 그리고 선택·합치기(union/intersection/xor/difference)·분할하는 데모 화면',
    cover: (
      <div style={iconCoverStyle('#e6f4ff')}>
        <BorderOutlined style={{ color: '#1677ff' }} />
      </div>
    ),
  },
  {
    to: '/region-view',
    title: '권역조회',
    description:
      '배송센터·서비스유형별 권역을 지도에서 조회하고, 줌레벨에 따라 소분류·세분류까지 확인하는 데모',
    cover: (
      <div style={iconCoverStyle('#f6ffed')}>
        <EnvironmentOutlined style={{ color: '#389e0d' }} />
      </div>
    ),
  },
  {
    to: '/xmark',
    title: 'X-MARK (Flash 이관)',
    description:
      'Flash로 만들어진 X-MARK 포트폴리오 갤러리 사이트를 이관하는 데모. 카드 진입 애니메이션, 3D 패럴럭스, 휠 스크롤 페이지 전환 등 구현',
    cover: (
      <img
        src={toAssetUrl('/xmark/img/img0.jpg')}
        alt=""
        style={imageCoverStyle}
      />
    ),
  },
  {
    to: '/roboking',
    title: 'LG 로보킹 (Flash 이관)',
    description:
      'Flash로 만들어진 LG 로보킹 청소 게임을 이관하는 데모. 메인 화면(랭킹/당첨자/게임방법/영상)과 3개 스테이지 게임플레이가 구현됨',
    status: '복원 진행중',
    cover: (
      <img
        src={toAssetUrl('/roboking/img/stage1_game_bg.png')}
        alt=""
        style={imageCoverStyle}
      />
    ),
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
            <Card hoverable cover={demo.cover} style={{ width: 280 }}>
              <Card.Meta
                title={
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    {demo.title}
                    {demo.status && (
                      <Tag color="gold" style={{ marginInlineEnd: 0 }}>
                        {demo.status}
                      </Tag>
                    )}
                  </span>
                }
                description={demo.description}
              />
            </Card>
          </Link>
        ))}
      </div>
    </div>
  ),
});
