import { Button, Divider, Flex, Space, Typography } from 'antd';
import type { ReactNode } from 'react';

import type { OperationType } from '../helper/polygonOperations';
import type { PolygonBoard } from '../hooks/usePolygonBoard';

const { Text } = Typography;

const MERGE_BUTTONS: Array<{ type: OperationType; label: string }> = [
  { type: 'union', label: '합집합' },
  { type: 'intersection', label: '교집합' },
  { type: 'xor', label: '교차점 제거' },
  { type: 'difference', label: '차집합' },
];

interface ToolbarGroupProps {
  label: string;
  children: ReactNode;
  /** 구분선을 그룹 안에 포함시켜, flex-wrap으로 줄이 바뀌어도 구분선만 혼자 떨어지지 않게 한다. */
  withLeadingDivider?: boolean;
}

function ToolbarGroup({
  label,
  children,
  withLeadingDivider,
}: ToolbarGroupProps) {
  return (
    <Flex align="center" gap={8}>
      {withLeadingDivider && (
        <Divider type="vertical" style={{ height: 24, margin: 0 }} />
      )}
      <Text type="secondary" style={{ fontSize: 12, whiteSpace: 'nowrap' }}>
        {label}
      </Text>
      <Space.Compact>{children}</Space.Compact>
    </Flex>
  );
}

interface PolygonToolbarProps {
  board: PolygonBoard;
}

export function PolygonToolbar({ board }: PolygonToolbarProps) {
  return (
    <Flex align="center" wrap="wrap" gap={16} style={{ marginBottom: 8 }}>
      <ToolbarGroup label="그리기">
        <Button
          type={board.activeOverlayType === 'polygon' ? 'primary' : 'default'}
          onClick={board.startPolygonDrawing}
        >
          폴리곤
        </Button>
        <Button
          type={board.activeOverlayType === 'polyline' ? 'primary' : 'default'}
          onClick={board.startLineDrawing}
        >
          분할선
        </Button>
        <Button
          disabled={!board.activeOverlayType}
          onClick={board.cancelDrawing}
        >
          취소
        </Button>
      </ToolbarGroup>

      <ToolbarGroup label="잘라내기" withLeadingDivider>
        <Button danger ghost onClick={board.executeSplit}>
          선으로 잘라내기
        </Button>
        <Button danger ghost onClick={board.executePunch}>
          폴리곤으로 잘라내기
        </Button>
      </ToolbarGroup>

      <ToolbarGroup label="병합" withLeadingDivider>
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

      <ToolbarGroup label="결과" withLeadingDivider>
        <Button type="primary" onClick={board.saveBasicPolygons}>
          폴리곤 저장
        </Button>
        <Button type="primary" onClick={board.printResult}>
          좌표 콘솔 출력
        </Button>
      </ToolbarGroup>
    </Flex>
  );
}
