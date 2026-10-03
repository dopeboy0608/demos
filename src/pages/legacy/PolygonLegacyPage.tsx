import { useRef, useState } from 'react';
import {
  DrawingManager,
  Map as KakaoMap,
  Polygon,
  useKakaoLoader,
} from 'react-kakao-maps-sdk';
import { Button, message, Radio, Tag } from 'antd';
import polygonSplitter from 'polygon-splitter';
import { difference, intersection, union, xor } from 'polygon-clipping';

import './deliveryRegion.css';

/**
 * 이전 회사 데모 화면(dos/src/components/tms/delivery/Region/
 * DeliveryRegionSettingTestManageBoard.jsx)을 "그대로" 포팅한 페이지다.
 *
 * - 공용 컴포넌트(BasicRadioTab)는 antd Radio.Group/Radio.Button으로 인라인 대체했다.
 * - 원본 상수(HK_SQUARE_BLD)는 이 파일에 그대로 값만 복사했다.
 * - antd Button의 `type="warning"`/`type="success"`는 이 antd 버전에 없는 타입이라
 *   danger/primary로 최소 치환했다.
 * - 나머지 로직(두 개의 DrawingManager가 같은 ref를 공유하는 부분 포함)은 원본과 동일하게
 *   유지했다 — 실제 동작을 먼저 확인한 뒤 features/polygon 구조로 마이그레이션할 예정이라
 *   지금은 의도적으로 손대지 않는다.
 * - 원본엔 카카오맵 SDK를 로드하는 코드가 없었다(아마 원본 프로젝트의 index.html에 <script>로
 *   미리 심어뒀을 것). 이 프로젝트엔 그런 전역 스크립트가 없어 지도가 전혀 안 뜨는 문제가
 *   있었고, `useKakaoLoader`로 SDK를 직접 로드하도록 최소 추가했다.
 * - 레이아웃은 원본(그리기 영역 위 / 결과 영역 아래, 세로 배치)과 달리 좌우 2단(그리기
 *   영역 왼쪽 / 결과 영역 오른쪽)으로 바꿨다 — 사용자 요청. 각 영역의 버튼 배치만 바뀌었고
 *   버튼/지도 자체의 동작 로직은 그대로다.
 * - 기능 재검토 중 발견한 버그 수정: "그리기 영역 리셋"이 원본에선 `manager.clear()`를
 *   호출했는데, 이 메서드는 카카오맵 드로잉 매니저 공식 API에 없다 — `getOverlays()` +
 *   `remove()`로 교체해 실제로 그려진 폴리곤/폴리라인을 지우도록 고쳤다.
 */

const DEFAULT_CENTER = { lat: 37.5001272, lng: 127.0334435 }; // 한국타이어빌딩 (원본 HK_SQUARE_BLD)

const EXECUTE_UNION = 'union';
const EXECUTE_INTERSECTION = 'intersection';
const EXECUTE_XOR = 'xor';
const EXECUTE_DIFFERENCE = 'difference';
type MergeExecuteType =
  | typeof EXECUTE_UNION
  | typeof EXECUTE_INTERSECTION
  | typeof EXECUTE_XOR
  | typeof EXECUTE_DIFFERENCE;

const MERGE_OPERATIONS = { union, intersection, xor, difference };

const POLYGON_NONE = 'polygon_none';
const POLYGON_EDIT = 'polygon_edit';
const POLYGON_SELECT = 'polygon_multi-select';
type PolygonClickType =
  typeof POLYGON_NONE | typeof POLYGON_EDIT | typeof POLYGON_SELECT;

type LatLng = { lat: number; lng: number };
type DrawnOverlayType =
  | kakao.maps.drawing.OverlayType.POLYGON
  | kakao.maps.drawing.OverlayType.POLYLINE;
type DrawingManagerHandle = kakao.maps.drawing.DrawingManager<DrawnOverlayType>;

export function PolygonLegacyPage() {
  const apiKey = import.meta.env.PUBLIC_KAKAO_MAP_API_KEY;
  const [loading, error] = useKakaoLoader({
    appkey: apiKey ?? '',
    libraries: ['drawing'],
  });

  const mapRef = useRef<kakao.maps.Map | null>(null);
  const drawingManagerRef = useRef<DrawingManagerHandle | null>(null);

  const [mapCenter, setMapCenter] = useState<LatLng>(DEFAULT_CENTER);
  const [zoomLevel, setZoomLevel] = useState(4);

  // 결과 영역에 뿌릴 폴리곤
  const [basicPolygonList, setBasicPolygonList] = useState<LatLng[][]>([]);
  const [splitPolygonList, setSplitPolygonList] = useState<LatLng[][]>([]);
  const [punchPolygonList, setPunchPolygonList] = useState<LatLng[][]>([]);
  const [mergePolygonList, setMergePolygonList] = useState<LatLng[][]>([]);

  // 폴리곤 클릭시 처리옵션
  const [polygonClickType, setPolygonClickType] =
    useState<PolygonClickType>(POLYGON_NONE);

  // 선택된 폴리곤 목록
  const [selectedPolygons, setSelectedPolygons] = useState<string[]>([]);

  // 폴리곤 그리기 시작
  const onPolygonDrawStart = () => {
    const manager = drawingManagerRef.current;
    if (!manager) return;
    manager.cancel();
    manager.select('polygon');
  };

  // 기본 결과 반영
  const onBasicExecute = () => {
    const manager = drawingManagerRef.current;
    if (!manager) return;

    const targetOverlayData = manager.getData().polygon;

    const targetPolygons = targetOverlayData.map(({ points }) =>
      points.map(({ x, y }) => ({ lat: y, lng: x })),
    );
    setBasicPolygonList(targetPolygons);
  };

  // 자르기용 폴리라인 그리기 시작
  const onSplitDrawStart = () => {
    const manager = drawingManagerRef.current;
    if (!manager) return;
    manager.cancel();
    manager.select('polyline');
  };

  // 폴리곤 선으로 자르기
  const onSplitExecute = () => {
    const manager = drawingManagerRef.current;
    if (!manager) return;

    const targetOverlayData = manager.getData();

    if (
      !targetOverlayData.polygon.length ||
      !targetOverlayData.polyline.length
    ) {
      message.error('폴리곤과 선을 그려주세요.');
      return;
    }

    const targetPolygons = targetOverlayData.polygon.map(({ points }) =>
      points.map((point): [number, number] => [point.y, point.x]),
    );

    if (targetPolygons.length > 1) {
      message.warning('처음 생성한 폴리곤에만 자르기가 적용됩니다.');
    }

    const targetPolyLines = targetOverlayData.polyline.map(({ points }) =>
      points.map((point): [number, number] => [point.y, point.x]),
    );

    if (targetPolyLines.length > 1) {
      message.warning('처음 생성한 라인으로 자르기가 적용됩니다.');
    }

    const polygon = {
      type: 'Polygon' as const,
      coordinates: [[...targetPolygons[0], targetPolygons[0][0]]],
    };

    const polyline = {
      type: 'LineString' as const,
      coordinates: targetPolyLines[0],
    };

    const result = polygonSplitter(polygon, polyline);
    // 분할선이 폴리곤을 가로지르지 않으면 원본 Polygon geometry가 그대로 반환되어
    // `.geometry`가 없다 — 원본 코드에도 있던 처리 누락이라 그대로 두고, 포팅본에서는
    // 타입만 느슨하게 캐스팅해 컴파일되게 한다(동작 확인 후 마이그레이션 단계에서 수정).
    const geometry = (
      result as { geometry?: { coordinates: [number, number][][][] } }
    ).geometry;
    if (!geometry) {
      message.error('분할선이 폴리곤을 가로지르지 않습니다.');
      return;
    }

    const splitPolygonResult = geometry.coordinates.map((polygonCoords) => {
      const targetPolygon = polygonCoords[0];
      return targetPolygon.map(([lat, lng]) => ({ lat, lng }));
    });

    setSplitPolygonList(splitPolygonResult);
  };

  // 폴리곤으로 구멍내기
  const onPunchExecute = () => {
    const manager = drawingManagerRef.current;
    if (!manager) return;

    const targetOverlayData = manager.getData();

    if (targetOverlayData.polygon.length < 2) {
      message.error('폴리곤을 그려주세요.');
      return;
    }

    const targetPolygons = targetOverlayData.polygon.map(({ points }) =>
      points.map(({ x, y }) => ({ lng: x, lat: y })),
    );

    setPunchPolygonList(targetPolygons);
  };

  // 폴리곤 병합
  const onMergeExecute = (executeType: MergeExecuteType) => {
    const manager = drawingManagerRef.current;
    if (!manager) return;

    const targetOverlayData = manager.getData();

    if (targetOverlayData.polygon.length < 2) {
      message.error('폴리곤을 2개 이상 그려주세요.');
      return;
    }

    const targetPolygons = targetOverlayData.polygon
      .map(({ points }) =>
        points.map((point): [number, number] => [point.y, point.x]),
      )
      .map((ring) => [ring]);

    const [firstPolygon, ...restPolygons] = targetPolygons;
    const mergePolygonResult = MERGE_OPERATIONS[executeType](
      firstPolygon,
      ...restPolygons,
    ).map((polygon) => polygon.flat().map(([lat, lng]) => ({ lat, lng })));

    if (!mergePolygonResult.length) {
      let errorMessage = '';
      switch (executeType) {
        case EXECUTE_UNION:
          errorMessage = '병합 결과가 없습니다.';
          break;
        case EXECUTE_INTERSECTION:
          errorMessage = '폴리곤들은 겹쳐있어야 합니다.';
          break;
      }
      if (errorMessage) message.error(errorMessage);
    }

    setMergePolygonList(mergePolygonResult);
  };

  // 좌표 결과 콘솔 출력
  const onPrintResult = () => {
    const manager = drawingManagerRef.current;
    if (!manager) return;
    console.log(manager.getData());
  };

  // 그리기영역 리셋
  // 원본은 `manager.clear()`를 호출했는데, 이 메서드는 카카오맵 드로잉 매니저 공식 API에
  // 없다(이 프로젝트의 타입 패키지에도 선언이 없음) — 기능 재검토 중 발견한 버그라
  // 문서화된 API(getOverlays + remove)로 교체했다.
  const onResetDraw = () => {
    const manager = drawingManagerRef.current;
    if (!manager) return;
    const overlays = manager.getOverlays();
    [...overlays.polygon, ...overlays.polyline].forEach((overlay) => {
      manager.remove(overlay);
    });
  };

  // 결과 영역 리셋
  const onResetResult = () => {
    setBasicPolygonList([]);
    setMergePolygonList([]);
    setSplitPolygonList([]);
    setPunchPolygonList([]);
    setSelectedPolygons([]);
  };

  // 선택된 폴리곤 목록 갱신
  const updateSelectedPolygons = (polygonId: string) => {
    setSelectedPolygons((prevState) => {
      const tempArr = [...prevState];
      const targetIndex = tempArr.indexOf(polygonId);
      if (targetIndex > -1) {
        tempArr.splice(targetIndex, 1);
        return tempArr;
      }
      return [...tempArr, polygonId];
    });
  };

  // 결과 폴리곤 클릭
  const onPolygonClick = (polygon: kakao.maps.Polygon, polygonId: string) => {
    const manager = drawingManagerRef.current;
    if (!manager) return;
    const polygonPaths = polygon.getPath();

    switch (polygonClickType) {
      case POLYGON_NONE:
        message.info(`클릭된 폴리곤 ::: ${polygonId}`, 3);
        break;
      case POLYGON_EDIT:
        if (Array.isArray(polygonPaths[0])) {
          (polygonPaths as unknown as kakao.maps.LatLng[][]).forEach((path) => {
            manager.put('polygon', path);
          });
        } else {
          manager.put('polygon', polygonPaths as kakao.maps.LatLng[]);
        }
        break;
      case POLYGON_SELECT:
        updateSelectedPolygons(polygonId);
        break;
    }
  };

  if (!apiKey) {
    return (
      <div role="alert">
        카카오맵 API 키(PUBLIC_KAKAO_MAP_API_KEY)가 설정되지 않았습니다.
        .env.local에 키를 입력한 뒤 다시 시도해주세요.
      </div>
    );
  }

  if (error) {
    return (
      <div role="alert">
        카카오맵 SDK 로딩에 실패했습니다. API 키를 확인해주세요.
      </div>
    );
  }

  if (loading) {
    return <div>지도를 불러오는 중...</div>;
  }

  return (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
      <section style={{ flex: 1, minWidth: 360 }}>
        <h4>
          <span style={{ verticalAlign: 'middle' }}># 그리기 영역</span>
          <Button className="ml-3" danger onClick={onResetDraw}>
            그리기 영역 리셋
          </Button>
        </h4>
        <div
          style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}
        >
          <Button type="primary" onClick={onPolygonDrawStart}>
            폴리곤 그리기
          </Button>
          <Button type="primary" onClick={onSplitDrawStart}>
            분할선 그리기
          </Button>
          <Button danger ghost onClick={onSplitExecute}>
            선으로 잘라내기 실행
          </Button>
          <Button danger ghost onClick={onPunchExecute}>
            폴리곤으로 잘라내기 실행
          </Button>
          <Button type="primary" onClick={() => onMergeExecute(EXECUTE_UNION)}>
            폴리곤 합집합 실행
          </Button>
          <Button
            type="primary"
            onClick={() => onMergeExecute(EXECUTE_INTERSECTION)}
          >
            폴리곤 교집합 실행
          </Button>
          <Button type="primary" onClick={() => onMergeExecute(EXECUTE_XOR)}>
            폴리곤 교차점 제거
          </Button>
          <Button
            type="primary"
            onClick={() => onMergeExecute(EXECUTE_DIFFERENCE)}
          >
            폴리곤 차집합
          </Button>
        </div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
          <Button type="primary" onClick={onBasicExecute}>
            폴리곤 저장
          </Button>
          <Button type="primary" onClick={onPrintResult}>
            좌표 결과 콘솔 출력
          </Button>
        </div>
        <KakaoMap
          ref={mapRef}
          className="delivery-region-test__map-wrapper"
          center={mapCenter}
          level={zoomLevel}
          disableDoubleClickZoom={true}
          disableDoubleClick={true}
          onZoomChanged={(map) => setZoomLevel(map.getLevel())}
          onCenterChanged={(map) => {
            setMapCenter({
              lat: map.getCenter().getLat(),
              lng: map.getCenter().getLng(),
            });
          }}
        >
          <DrawingManager<DrawnOverlayType>
            ref={drawingManagerRef}
            drawingMode={['polyline', 'polygon']}
            guideTooltip={['draw', 'drag', 'edit']}
            markerOptions={{ draggable: true, removable: true }}
            polylineOptions={{
              draggable: true,
              removable: true,
              editable: true,
              strokeColor: '#39f',
              hintStrokeStyle: 'dash',
              hintStrokeOpacity: 0.5,
            }}
            polygonOptions={{
              draggable: true,
              removable: true,
              editable: true,
              strokeColor: '#39f',
              fillColor: '#39f',
              fillOpacity: 0.5,
              hintStrokeStyle: 'dash',
              hintStrokeOpacity: 0.5,
            }}
          />
        </KakaoMap>
      </section>

      <section style={{ flex: 1, minWidth: 360 }}>
        <h4
          style={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <span style={{ verticalAlign: 'middle' }}># 결과 영역</span>
          <Radio.Group
            value={polygonClickType}
            onChange={({ target: { value } }) => setPolygonClickType(value)}
          >
            <Radio.Button value={POLYGON_NONE}>기능없음</Radio.Button>
            <Radio.Button value={POLYGON_EDIT}>폴리곤 수정</Radio.Button>
            <Radio.Button value={POLYGON_SELECT}>다중선택</Radio.Button>
          </Radio.Group>
          <Button danger onClick={onResetResult}>
            결과 영역 리셋
          </Button>
        </h4>
        <div style={{ marginBottom: 8 }}>
          {selectedPolygons.map((polygonId) => (
            <Tag
              key={polygonId}
              closable
              onClose={(e) => {
                e.preventDefault();
                updateSelectedPolygons(polygonId);
              }}
            >
              {polygonId}
            </Tag>
          ))}
        </div>
        <KakaoMap
          className="delivery-region-test__map-wrapper"
          center={mapCenter}
          level={zoomLevel}
          disableDoubleClickZoom={true}
          disableDoubleClick={true}
          onZoomChanged={(map) => setZoomLevel(map.getLevel())}
          onCenterChanged={(map) => {
            setMapCenter({
              lat: map.getCenter().getLat(),
              lng: map.getCenter().getLng(),
            });
          }}
        >
          {basicPolygonList.map((polygon, index) => {
            const polygonId = `basic_${index}`;
            return (
              <Polygon
                key={polygonId}
                path={polygon}
                strokeWeight={2}
                strokeColor={'#b26bb2'}
                strokeOpacity={0.8}
                fillColor={'#f9f'}
                fillOpacity={selectedPolygons.includes(polygonId) ? 0.8 : 0.5}
                onClick={(polygon) => onPolygonClick(polygon, polygonId)}
              />
            );
          })}

          {punchPolygonList.length > 0 && (
            <Polygon
              key={'punch_polygon'}
              path={punchPolygonList}
              strokeWeight={2}
              strokeColor={'#b26bb2'}
              strokeOpacity={0.8}
              fillColor={'#f9f'}
              fillOpacity={
                selectedPolygons.includes('punch_polygon') ? 0.8 : 0.5
              }
              onClick={(polygon) => onPolygonClick(polygon, 'punch_polygon')}
            />
          )}

          {splitPolygonList.map((polygon, index) => {
            const polygonId = `split_${index}`;
            return (
              <Polygon
                key={polygonId}
                path={polygon}
                strokeWeight={2}
                strokeColor={'#b26bb2'}
                strokeOpacity={0.8}
                fillColor={'#f9f'}
                fillOpacity={selectedPolygons.includes(polygonId) ? 0.8 : 0.5}
                onClick={(polygon) => onPolygonClick(polygon, polygonId)}
              />
            );
          })}
          {mergePolygonList.map((polygon, index) => {
            const polygonId = `merge_${index}`;
            return (
              <Polygon
                key={polygonId}
                path={polygon}
                strokeWeight={2}
                strokeColor={'#b26bb2'}
                strokeOpacity={0.8}
                fillColor={'#f9f'}
                fillOpacity={selectedPolygons.includes(polygonId) ? 0.8 : 0.5}
                onClick={(polygon) => onPolygonClick(polygon, polygonId)}
              />
            );
          })}
        </KakaoMap>
      </section>
    </div>
  );
}
