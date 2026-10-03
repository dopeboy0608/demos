import { Button } from 'antd';

import type { OperationType } from '../helper/polygonOperations';
import type { PolygonBoard } from '../hooks/usePolygonBoard';

const MERGE_BUTTONS: Array<{ type: OperationType; label: string }> = [
  { type: 'union', label: '폴리곤 합집합 실행' },
  { type: 'intersection', label: '폴리곤 교집합 실행' },
  { type: 'xor', label: '폴리곤 교차점 제거' },
  { type: 'difference', label: '폴리곤 차집합' },
];

interface PolygonToolbarProps {
  board: PolygonBoard;
}

export function PolygonToolbar({ board }: PolygonToolbarProps) {
  return (
    <>
      <div
        style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}
      >
        <Button type="primary" onClick={board.startPolygonDrawing}>
          폴리곤 그리기
        </Button>
        <Button type="primary" onClick={board.startLineDrawing}>
          분할선 그리기
        </Button>
        <Button danger ghost onClick={board.executeSplit}>
          선으로 잘라내기 실행
        </Button>
        <Button danger ghost onClick={board.executePunch}>
          폴리곤으로 잘라내기 실행
        </Button>
        {MERGE_BUTTONS.map(({ type, label }) => (
          <Button
            key={type}
            type="primary"
            onClick={() => board.executeMerge(type)}
          >
            {label}
          </Button>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <Button type="primary" onClick={board.saveBasicPolygons}>
          폴리곤 저장
        </Button>
        <Button type="primary" onClick={board.printResult}>
          좌표 결과 콘솔 출력
        </Button>
      </div>
    </>
  );
}
