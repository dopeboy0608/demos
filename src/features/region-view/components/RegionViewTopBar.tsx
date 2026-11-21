import { Row, Switch } from 'antd';

import { RegionViewLocationSearch } from './RegionViewLocationSearch';

interface RegionViewTopBarProps {
  onSearchResult: (result: {
    searchType: string;
    position: { lat: number; lng: number };
  }) => void;
}

export function RegionViewTopBar({ onSearchResult }: RegionViewTopBarProps) {
  return (
    <Row justify="space-between" align="middle" style={{ width: '100%' }}>
      <RegionViewLocationSearch onSearchResult={onSearchResult} />
      <Row align="middle" style={{ gap: 8 }}>
        <span className="font-weight-bold" style={{ marginRight: 8 }}>
          불가지역 &#124;
        </span>
        <Switch
          checkedChildren="ON"
          unCheckedChildren="OFF"
          defaultChecked
          disabled
        />
      </Row>
    </Row>
  );
}
