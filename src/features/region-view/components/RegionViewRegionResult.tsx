import { PushpinOutlined } from '@ant-design/icons';
import { Button, Collapse, Divider, Tag } from 'antd';

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
            {/* 행정구역 센터(서울/경기)는 코드가 아닌 긴 지역명을 쓰므로, 고정 원형 대신
                내용 길이에 맞춰 늘어나는 pill 배지로 표기한다(#84). */}
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: 22,
                height: 22,
                flexShrink: 0,
                borderRadius: 11,
                padding: '0 8px',
                backgroundColor: regionGroupColors[group.regionGroupCode],
                color: '#fff',
                fontSize: 10,
                fontWeight: 700,
                whiteSpace: 'nowrap',
              }}
            >
              {group.label ?? group.regionGroupCode}
            </span>
            <span style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              <Tag>우편번호 {group.zipCodeCount}</Tag>
              <Tag>소분류 권역 {group.regionCount}</Tag>
              <Tag>세분류 권역 {group.subRegionCount}</Tag>
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
