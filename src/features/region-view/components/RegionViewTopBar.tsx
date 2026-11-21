import { Row, Switch } from 'antd';

export function RegionViewTopBar() {
  return (
    <Row justify="space-between" align="middle" style={{ width: '100%' }}>
      <div style={{ color: '#999' }}>
        주소/우편번호/위경도 검색 (다음 서브태스크에서 추가됩니다)
      </div>
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
