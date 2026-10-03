import type { ReactNode } from 'react';
import { Layout, Menu } from 'antd';
import { Link, useRouterState } from '@tanstack/react-router';

const { Header, Content } = Layout;

const NAV_ITEMS = [
  { key: '/', label: <Link to="/">홈</Link> },
  { key: '/polygon', label: <Link to="/polygon">폴리곤 제어</Link> },
  {
    key: '/polygon-legacy',
    label: <Link to="/polygon-legacy">폴리곤 제어(원본 포팅)</Link>,
  },
];

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  return (
    <Layout style={{ minHeight: '100vh' }}>
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
      <Content style={{ padding: 24 }}>{children}</Content>
    </Layout>
  );
}
