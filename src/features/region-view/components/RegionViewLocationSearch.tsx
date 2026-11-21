import { AutoComplete, Button, Input, message, Select } from 'antd';
import { useState } from 'react';

import {
  fetchOmsAddressLocation,
  fetchZipcodeLocation,
} from '../api/regionViewApi';
import {
  LOCATION_SEARCH_TYPE_OPTIONS,
  LOCATION_SEARCH_TYPES,
} from '../helper/constants';

interface SearchResult {
  searchType: string;
  position: { lat: number; lng: number };
}

interface RegionViewLocationSearchProps {
  onSearchResult: (result: SearchResult) => void;
}

interface AddressOption {
  value: string;
  position: { lat: number; lng: number };
}

export function RegionViewLocationSearch({
  onSearchResult,
}: RegionViewLocationSearchProps) {
  const [searchType, setSearchType] = useState<string>(
    LOCATION_SEARCH_TYPES.ADDRESS,
  );
  const [searchText, setSearchText] = useState('');
  const [addressOptions, setAddressOptions] = useState<AddressOption[]>([]);
  const [lng, setLng] = useState('');
  const [lat, setLat] = useState('');

  const handleChangeSearchType = (value: string) => {
    setSearchType(value);
    setSearchText('');
    setAddressOptions([]);
    setLng('');
    setLat('');
  };

  const handleAddressSearch = (text: string) => {
    setSearchText(text);

    if (!text) {
      setAddressOptions([]);
      return;
    }

    if (typeof kakao === 'undefined' || !kakao.maps.services) {
      return;
    }

    const places = new kakao.maps.services.Places();
    places.keywordSearch(text, (data, status) => {
      if (status !== kakao.maps.services.Status.OK) {
        setAddressOptions([]);
        return;
      }

      setAddressOptions(
        data.map((item) => ({
          value: item.place_name,
          position: { lat: Number(item.y), lng: Number(item.x) },
        })),
      );
    });
  };

  const handleSelectAddress = (_value: string, option: AddressOption) => {
    onSearchResult({
      searchType: LOCATION_SEARCH_TYPES.ADDRESS,
      position: option.position,
    });
  };

  const handleZipcodeSearch = async () => {
    if (!/^\d{5}$/.test(searchText)) {
      message.error('신우편번호 5자를 입력해주세요.');
      return;
    }

    const result = await fetchZipcodeLocation(searchText);
    if (!result) {
      message.error('검색 결과가 없습니다.');
      return;
    }

    onSearchResult({
      searchType: LOCATION_SEARCH_TYPES.ZIPCODE,
      position: result.position,
    });
  };

  const handleOmsSearch = async () => {
    if (!searchText) {
      message.error('배송 주소를 입력해주세요.');
      return;
    }

    const result = await fetchOmsAddressLocation(searchText);
    if (!result) {
      message.error('검색 결과가 없습니다.');
      return;
    }

    onSearchResult({
      searchType: LOCATION_SEARCH_TYPES.ADDRESS_WITH_OMS,
      position: result.position,
    });
  };

  const handleLatLngSearch = () => {
    if (!lng) {
      message.error('X좌표를 입력해주세요');
      return;
    }
    if (!lat) {
      message.error('Y좌표를 입력해주세요');
      return;
    }

    const lngNum = Number(lng);
    const latNum = Number(lat);
    if (lngNum < 124 || lngNum > 132 || latNum < 33 || latNum > 43) {
      message.error('X, Y좌표가 올바른 형식이 아닙니다.');
      return;
    }

    onSearchResult({
      searchType: LOCATION_SEARCH_TYPES.LAT_LNG,
      position: { lat: latNum, lng: lngNum },
    });
  };

  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <Select
        style={{ width: 110 }}
        value={searchType}
        options={LOCATION_SEARCH_TYPE_OPTIONS}
        onChange={handleChangeSearchType}
      />

      {searchType === LOCATION_SEARCH_TYPES.ADDRESS && (
        <AutoComplete
          style={{ width: 300 }}
          value={searchText}
          options={addressOptions}
          onSearch={handleAddressSearch}
          onSelect={(value, option) =>
            handleSelectAddress(value, option as AddressOption)
          }
          placeholder="주소 또는 건물명을 입력해주세요."
        />
      )}

      {searchType === LOCATION_SEARCH_TYPES.ADDRESS_WITH_OMS && (
        <>
          <Input
            style={{ width: 300 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="배송 주소를 입력해주세요."
          />
          <Button onClick={handleOmsSearch}>검색</Button>
        </>
      )}

      {searchType === LOCATION_SEARCH_TYPES.ZIPCODE && (
        <>
          <Input
            style={{ width: 150 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="신우편번호 5자를 입력해주세요."
          />
          <Button onClick={handleZipcodeSearch}>검색</Button>
        </>
      )}

      {searchType === LOCATION_SEARCH_TYPES.LAT_LNG && (
        <>
          <Input
            style={{ width: 100 }}
            value={lng}
            onChange={(e) => setLng(e.target.value)}
            placeholder="x좌표"
          />
          <Input
            style={{ width: 100 }}
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            placeholder="y좌표"
          />
          <Button onClick={handleLatLngSearch}>검색</Button>
        </>
      )}
    </div>
  );
}
