import { Row, Switch, Tag } from 'antd';

import { REGION_SUB_SORTING_OPTIONS } from '../helper/constants';
import { RegionViewLocationSearch } from './RegionViewLocationSearch';

interface RegionViewTopBarProps {
  sortingTypeCode: string;
  isImpossibleView: boolean;
  onSearchResult: (result: {
    searchType: string;
    position: { lat: number; lng: number };
  }) => void;
  onChangeSortingType: (code: string) => void;
  onChangeImpossibleView: (value: boolean) => void;
}

export function RegionViewTopBar({
  sortingTypeCode,
  isImpossibleView,
  onSearchResult,
  onChangeSortingType,
  onChangeImpossibleView,
}: RegionViewTopBarProps) {
  return (
    <Row justify="space-between" align="middle" style={{ width: '100%' }}>
      <RegionViewLocationSearch onSearchResult={onSearchResult} />
      <Row align="middle" style={{ gap: 16 }}>
        <Row align="middle" style={{ gap: 4 }}>
          {REGION_SUB_SORTING_OPTIONS.map((option) => (
            <Tag.CheckableTag
              key={option.value}
              checked={sortingTypeCode === option.value}
              onChange={(checked) => {
                if (checked) onChangeSortingType(option.value);
              }}
            >
              {option.label}
            </Tag.CheckableTag>
          ))}
        </Row>
        <Row align="middle" style={{ gap: 8 }}>
          <span className="font-weight-bold" style={{ marginRight: 8 }}>
            불가지역 &#124;
          </span>
          <Switch
            checkedChildren="ON"
            unCheckedChildren="OFF"
            checked={isImpossibleView}
            onChange={onChangeImpossibleView}
          />
        </Row>
      </Row>
    </Row>
  );
}
