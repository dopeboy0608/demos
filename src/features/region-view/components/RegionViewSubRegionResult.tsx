import { PushpinOutlined } from '@ant-design/icons';
import { Button, Collapse, Tag } from 'antd';

import type { RegionItem } from '../api/regionViewApi';

interface RegionViewSubRegionResultProps {
  regions: RegionItem[];
  regionGroupCode: string;
  sortingTypeCode: string;
  onLocationSearchClick: (
    payload: {
      regionGroupCode: string;
      code: string;
      sortingLevel: 'REGION' | 'SUB_REGION';
      sortingTypeCode: string;
    },
    searchType: 'SUB_DIVISION' | 'MICRO_DIVISION',
  ) => void;
}

export function RegionViewSubRegionResult({
  regions,
  regionGroupCode,
  sortingTypeCode,
  onLocationSearchClick,
}: RegionViewSubRegionResultProps) {
  if (!regions.length) return null;

  return (
    <div>
      <Tag style={{ fontSize: 10, background: '#ebebeb', borderRadius: 8 }}>
        {sortingTypeCode === 'NORMAL' ? '일반' : '상온 only'}
      </Tag>
      <Collapse
        expandIconPlacement="end"
        items={regions.map((region) => ({
          key: region.regionCode,
          label: (
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>{region.label ?? region.regionCode}</span>
              <Tag>세분류 권역 {region.subRegions.length}</Tag>
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
                onLocationSearchClick(
                  {
                    regionGroupCode,
                    code: region.regionCode,
                    sortingLevel: 'REGION',
                    sortingTypeCode,
                  },
                  'SUB_DIVISION',
                );
              }}
            />
          ),
          children: (
            <div>
              {region.subRegions.map((subRegion) => (
                <div
                  key={subRegion.subRegionCode}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4,
                    padding: '6px 0',
                  }}
                >
                  {/* 위치보기 버튼은 배송회차 Tag 개수와 무관하게 항상 같은 자리에 고정되도록
                      라벨 행과 Tag 행을 분리한다(라벨이 길거나 회차가 여러 개여도 버튼이
                      밀려나지 않음, #94). */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    <span style={{ flex: 1, minWidth: 0 }}>
                      {subRegion.label ?? subRegion.subRegionCode}
                    </span>
                    <Button
                      shape="circle"
                      size="small"
                      title="위치보기"
                      icon={<PushpinOutlined />}
                      style={{ flexShrink: 0 }}
                      onClick={() =>
                        onLocationSearchClick(
                          {
                            regionGroupCode,
                            code: subRegion.subRegionCode,
                            sortingLevel: 'SUB_REGION',
                            sortingTypeCode,
                          },
                          'MICRO_DIVISION',
                        )
                      }
                    />
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {subRegion.deliveryRounds.length ? (
                      subRegion.deliveryRounds.map((round) => (
                        <Tag key={round}>배송회차 {round}</Tag>
                      ))
                    ) : (
                      <Tag>배송회차 정보없음</Tag>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ),
        }))}
      />
    </div>
  );
}
