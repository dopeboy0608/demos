import { Collapse, Typography } from 'antd';

export function RegionViewSearchPanel() {
  return (
    <Collapse
      defaultActiveKey={['1', '2']}
      expandIconPlacement="end"
      items={[
        {
          key: '1',
          label: (
            <Typography.Text style={{ fontWeight: 500 }}>
              검색 조건
            </Typography.Text>
          ),
          collapsible: 'disabled',
          children: (
            <div style={{ padding: 4 }}>
              검색 조건 입력은 다음 서브태스크에서 추가됩니다.
            </div>
          ),
        },
        {
          key: '2',
          label: (
            <Typography.Text style={{ fontWeight: 500 }}>
              상세 권역
            </Typography.Text>
          ),
          collapsible: 'disabled',
          children: (
            <div style={{ padding: 4 }}>검색 조건을 설정 해주세요.</div>
          ),
        },
      ]}
    />
  );
}
