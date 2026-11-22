import { Link, useRouterState } from '@tanstack/react-router';
import { Layout, Menu } from 'antd';
import type { ReactNode } from 'react';

const { Header, Content } = Layout;

const NAV_ITEMS = [
  { key: '/', label: <Link to="/">홈</Link> },
  { key: '/polygon', label: <Link to="/polygon">폴리곤 제어</Link> },
  { key: '/region-view', label: <Link to="/region-view">권역조회</Link> },
  { key: '/xmark', label: <Link to="/xmark">X-MARK</Link> },
  { key: '/roboking', label: <Link to="/roboking">LG 로보킹</Link> },
  { key: '/vonin', label: <Link to="/vonin">보닌</Link> },
];

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  return (
    <Layout style={{ height: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <span
          style={{
            color: '#fff',
            fontWeight: 600,
            fontSize: 18,
            whiteSpace: 'nowrap',
          }}
        >
          demos
        </span>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[pathname]}
          items={NAV_ITEMS}
          style={{ flex: 1, minWidth: 0 }}
        />
      </Header>
      <Content
        style={{
          padding: 24,
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
          overflow: 'auto',
        }}
      >
        {children}
      </Content>
    </Layout>
  );
}
