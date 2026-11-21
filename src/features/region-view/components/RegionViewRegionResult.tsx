import { PushpinOutlined } from '@ant-design/icons';
import { Button, Collapse, Divider } from 'antd';

import type { RegionGroupListItem } from '../api/regionViewApi';
import { RegionViewSubRegionResult } from './RegionViewSubRegionResult';

interface RegionViewRegionResultProps {
  regionGroupList: RegionGroupListItem[];
  onLocationSearchClick: (
    payload:
      | string
      | {
          regionGroupCode: string;
          code: string;
          sortingLevel: 'REGION' | 'SUB_REGION';
          sortingTypeCode: string;
        },
    searchType?: 'SUB_DIVISION' | 'MICRO_DIVISION',
  ) => void;
}

export function RegionViewRegionResult({
  regionGroupList,
  onLocationSearchClick,
}: RegionViewRegionResultProps) {
  return (
    <Collapse
      expandIconPlacement="end"
      items={regionGroupList.map((group) => ({
        key: group.regionGroupCode,
        label: (
          <span>
            {group.regionGroupCode} 우편번호 {group.zipCodeCount} · 소분류 권역{' '}
            {group.regionCount} | 세분류 권역 {group.subRegionCount}
          </span>
        ),
        extra: (
          <Button
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onLocationSearchClick(group.regionGroupCode);
            }}
          >
            <PushpinOutlined /> 위치보기
          </Button>
        ),
        children: (
          <>
            <RegionViewSubRegionResult
              regions={group.regions.filter(
                (region) => region.sortingTypeCode === 'NORMAL',
              )}
              regionGroupCode={group.regionGroupCode}
              sortingTypeCode="NORMAL"
              onLocationSearchClick={onLocationSearchClick}
            />
            <Divider dashed />
            <RegionViewSubRegionResult
              regions={group.regions.filter(
                (region) => region.sortingTypeCode !== 'NORMAL',
              )}
              regionGroupCode={group.regionGroupCode}
              sortingTypeCode="ROOM_ONLY"
              onLocationSearchClick={onLocationSearchClick}
            />
          </>
        ),
      }))}
    />
  );
}
