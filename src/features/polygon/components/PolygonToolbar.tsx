import { Button } from 'antd';
import type { ReactNode } from 'react';

import type { OperationType } from '../helper/polygonOperations';
import type { PolygonBoard } from '../hooks/usePolygonBoard';

const MERGE_BUTTONS: Array<{ type: OperationType; label: string }> = [
  { type: 'union', label: '폴리곤 합집합 실행' },
  { type: 'intersection', label: '폴리곤 교집합 실행' },
  { type: 'xor', label: '폴리곤 교차점 제거' },
  { type: 'difference', label: '폴리곤 차집합' },
];

interface ToolbarGroupProps {
  label: string;
  children: ReactNode;
}

function ToolbarGroup({ label, children }: ToolbarGroupProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        padding: '6px 10px',
        border: '1px solid #f0f0f0',
        borderRadius: 6,
      }}
    >
      <span style={{ fontSize: 12, color: 'rgba(0, 0, 0, 0.45)' }}>
        {label}
      </span>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {children}
      </div>
    </div>
  );
}

interface PolygonToolbarProps {
  board: PolygonBoard;
}

export function PolygonToolbar({ board }: PolygonToolbarProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        gap: 12,
        marginBottom: 8,
      }}
    >
      <ToolbarGroup label="그리기">
        <Button
          type={board.activeOverlayType === 'polygon' ? 'primary' : 'default'}
          onClick={board.startPolygonDrawing}
        >
          폴리곤 그리기
        </Button>
        <Button
          type={board.activeOverlayType === 'polyline' ? 'primary' : 'default'}
          onClick={board.startLineDrawing}
        >
          분할선 그리기
        </Button>
        <Button
          disabled={!board.activeOverlayType}
          onClick={board.cancelDrawing}
        >
          그리기 취소
        </Button>
      </ToolbarGroup>

      <ToolbarGroup label="잘라내기">
        <Button danger ghost onClick={board.executeSplit}>
          선으로 잘라내기 실행
        </Button>
        <Button danger ghost onClick={board.executePunch}>
          폴리곤으로 잘라내기 실행
        </Button>
      </ToolbarGroup>

      <ToolbarGroup label="병합">
        {MERGE_BUTTONS.map(({ type, label }) => (
          <Button
            key={type}
            type="primary"
            onClick={() => board.executeMerge(type)}
          >
            {label}
          </Button>
        ))}
      </ToolbarGroup>

      <ToolbarGroup label="결과">
        <Button type="primary" onClick={board.saveBasicPolygons}>
          폴리곤 저장
        </Button>
        <Button type="primary" onClick={board.printResult}>
          좌표 결과 콘솔 출력
        </Button>
      </ToolbarGroup>
    </div>
  );
}
