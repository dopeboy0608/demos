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
            <span>
              {region.label ?? region.regionCode} 세분류 권역{' '}
              {region.subRegions.length}
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
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '4px 0',
                  }}
                >
                  <span>
                    {subRegion.label ?? subRegion.subRegionCode} 배송회차{' '}
                    {subRegion.deliveryRounds.length
                      ? subRegion.deliveryRounds.join('/')
                      : '정보없음'}
                  </span>
                  <Button
                    shape="circle"
                    size="small"
                    title="위치보기"
                    icon={<PushpinOutlined />}
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
              ))}
            </div>
          ),
        }))}
      />
    </div>
  );
}
