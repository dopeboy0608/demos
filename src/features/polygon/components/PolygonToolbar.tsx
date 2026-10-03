import { Button, Space } from 'antd';

import type { OperationType } from '../helper/polygonOperations';

const OPERATION_LABELS: Record<OperationType, string> = {
  union: '합치기(union)',
  intersection: '교집합(intersection)',
  xor: 'XOR',
  difference: '차집합(difference)',
};

interface PolygonToolbarProps {
  drawingMode: boolean;
  onToggleDrawing: () => void;
  splitMode: boolean;
  onToggleSplit: () => void;
  selectedCount: number;
  polygonCount: number;
  onApplyOperation: (type: OperationType) => void;
  onDeleteSelected: () => void;
  onClearAll: () => void;
}

export function PolygonToolbar({
  drawingMode,
  onToggleDrawing,
  splitMode,
  onToggleSplit,
  selectedCount,
  polygonCount,
  onApplyOperation,
  onDeleteSelected,
  onClearAll,
}: PolygonToolbarProps) {
  // FR-006: 정확히 2개 선택됐을 때만 합치기 연산 버튼을 활성화한다.
  const canOperate = selectedCount === 2;
  // 분할은 정확히 1개 선택됐을 때만 활성화한다.
  const canSplit = selectedCount === 1;

  return (
    <Space wrap>
      <Button
        type={drawingMode ? 'primary' : 'default'}
        onClick={onToggleDrawing}
      >
        {drawingMode ? '그리기 종료' : '그리기'}
      </Button>
      {(Object.keys(OPERATION_LABELS) as OperationType[]).map((type) => (
        <Button
          key={type}
          disabled={!canOperate}
          onClick={() => onApplyOperation(type)}
        >
          {OPERATION_LABELS[type]}
        </Button>
      ))}
      <Button
        type={splitMode ? 'primary' : 'default'}
        disabled={!splitMode && !canSplit}
        onClick={onToggleSplit}
      >
        {splitMode ? '분할 종료' : '분할'}
      </Button>
      <Button danger disabled={selectedCount === 0} onClick={onDeleteSelected}>
        선택 삭제
      </Button>
      <Button danger disabled={polygonCount === 0} onClick={onClearAll}>
        전체 삭제
      </Button>
    </Space>
  );
}
