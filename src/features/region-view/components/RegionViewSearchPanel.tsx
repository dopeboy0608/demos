import { CheckOutlined, CloudDownloadOutlined } from '@ant-design/icons';
import { Button, Collapse, message, Row, Select, Tag, Typography } from 'antd';
import { useState } from 'react';
import type {
  LocationSearchPayload,
  RegionGroupListItem,
} from '../api/regionViewApi';
import {
  DELIVERY_DATE_RANGE_DAYS,
  DELIVERY_DATE_TOMORROW_HOUR,
  SERVICE_TYPE,
  SERVICE_TYPE_OPTIONS,
  TEMP_REGION_GROUP_OPTIONS,
} from '../helper/constants';
import { createDeliveryDateOptions } from '../helper/deliveryDateOptions';
import { RegionViewRegionResult } from './RegionViewRegionResult';

interface RegionViewSearchPanelProps {
  hasSearched: boolean;
  hasEmptyResult: boolean;
  regionGroupList: RegionGroupListItem[];
  onSearchSubmit: (params: {
    pdd: string;
    regionGroupCodes: string[];
    serviceType: string;
  }) => void;
  onLocationSearchClick: (
    payload: string | LocationSearchPayload,
    searchType?: 'SUB_DIVISION' | 'MICRO_DIVISION',
  ) => void;
  onDownloadZipcodeExcel: (pdd: string) => void;
}

export function RegionViewSearchPanel({
  hasSearched,
  hasEmptyResult,
  regionGroupList,
  onSearchSubmit,
  onLocationSearchClick,
  onDownloadZipcodeExcel,
}: RegionViewSearchPanelProps) {
  const [serviceType, setServiceType] = useState<string>(SERVICE_TYPE.DAWN);

  const pddOptions = createDeliveryDateOptions(
    new Date(),
    DELIVERY_DATE_RANGE_DAYS,
    DELIVERY_DATE_TOMORROW_HOUR,
  );
  const [pdd, setPdd] = useState(pddOptions[0].value);

  const [regionGroupCodes, setRegionGroupCodes] = useState<string[]>([]);
  const [regionGroupError, setRegionGroupError] = useState(false);

  const regionGroupOptions = TEMP_REGION_GROUP_OPTIONS.filter(
    (option) => option.serviceType === serviceType,
  );
  const isAllSelected =
    regionGroupOptions.length > 0 &&
    regionGroupCodes.length === regionGroupOptions.length;

  const handleChangeServiceType = (value: string) => {
    setServiceType(value);
    setRegionGroupCodes([]);
  };

  const handleAllSelect = (checked: boolean) => {
    setRegionGroupCodes(
      checked ? regionGroupOptions.map((option) => option.code) : [],
    );
  };

  const handleRegionGroupTagChange = (code: string, checked: boolean) => {
    setRegionGroupCodes((prev) =>
      checked ? [...prev, code] : prev.filter((c) => c !== code),
    );
  };

  const handleSubmit = () => {
    if (!regionGroupCodes.length) {
      setRegionGroupError(true);
      message.error('배송 센터를 선택해 주세요.');
      return;
    }

    setRegionGroupError(false);
    onSearchSubmit({ pdd, regionGroupCodes, serviceType });
  };

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
              <div style={{ marginBottom: 12 }}>
                <Typography.Text>서비스 유형</Typography.Text>
                <Select
                  style={{ width: '100%' }}
                  value={serviceType}
                  options={SERVICE_TYPE_OPTIONS}
                  onChange={handleChangeServiceType}
                />
              </div>
              <div style={{ marginBottom: 12 }}>
                <Typography.Text>배송 예정일</Typography.Text>
                <Select
                  style={{ width: '100%' }}
                  value={pdd}
                  options={pddOptions}
                  onChange={setPdd}
                />
              </div>
              <div style={{ marginBottom: 12 }}>
                <Typography.Text>배송 센터</Typography.Text>
                <div
                  style={{
                    height: 130,
                    overflowY: 'auto',
                    border: `1px solid ${regionGroupError ? 'red' : '#d9d9d9'}`,
                    borderRadius: 4,
                    padding: 4,
                  }}
                >
                  <Tag.CheckableTag
                    checked={isAllSelected}
                    onChange={handleAllSelect}
                  >
                    <CheckOutlined /> 전체선택
                  </Tag.CheckableTag>
                  {regionGroupOptions.map((option) => (
                    <Tag.CheckableTag
                      key={option.code}
                      checked={regionGroupCodes.includes(option.code)}
                      onChange={(checked) =>
                        handleRegionGroupTagChange(option.code, checked)
                      }
                    >
                      <CheckOutlined /> {option.code}
                    </Tag.CheckableTag>
                  ))}
                </div>
              </div>
              <Button type="primary" block onClick={handleSubmit}>
                검색
              </Button>
            </div>
          ),
        },
        {
          key: '2',
          label: (
            <Row justify="space-between" align="middle">
              <Typography.Text style={{ fontWeight: 500 }}>
                상세 권역
              </Typography.Text>
              <Button
                size="small"
                type="primary"
                shape="round"
                disabled={!regionGroupList.length}
                onClick={(e) => {
                  e.stopPropagation();
                  onDownloadZipcodeExcel(pdd);
                }}
              >
                <CloudDownloadOutlined /> 우편번호 다운로드
              </Button>
            </Row>
          ),
          collapsible: 'disabled',
          children: (
            <div style={{ padding: 4 }}>
              {!hasSearched ? (
                '검색 조건을 설정 해주세요.'
              ) : hasEmptyResult ? (
                '검색 결과가 없습니다.'
              ) : (
                <RegionViewRegionResult
                  regionGroupList={regionGroupList}
                  onLocationSearchClick={onLocationSearchClick}
                />
              )}
            </div>
          ),
        },
      ]}
    />
  );
}
