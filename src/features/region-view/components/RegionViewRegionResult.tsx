import { PushpinOutlined } from '@ant-design/icons';
import { Button, Collapse, Divider } from 'antd';

import type { RegionGroupListItem } from '../api/regionViewApi';
import { createRegionGroupColors } from '../helper/regionViewParser';
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
  const regionGroupColors = createRegionGroupColors(
    regionGroupList.map((group) => group.regionGroupCode),
  );

  return (
    <Collapse
      expandIconPlacement="end"
      items={regionGroupList.map((group) => ({
        key: group.regionGroupCode,
        label: (
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 22,
                height: 22,
                flexShrink: 0,
                borderRadius: '50%',
                backgroundColor: regionGroupColors[group.regionGroupCode],
                color: '#fff',
                fontSize: 10,
                fontWeight: 700,
              }}
            >
              {group.regionGroupCode}
            </span>
            <span>
              우편번호 {group.zipCodeCount} · 소분류 권역 {group.regionCount} |
              세분류 권역 {group.subRegionCount}
            </span>
          </span>
        ),
        extra: (
          <Button
            shape="circle"
            size="small"
            title="위치보기"
            icon={<PushpinOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              onLocationSearchClick(group.regionGroupCode);
            }}
          />
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
