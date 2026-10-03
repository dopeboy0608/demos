import { DrawingAreaPanel } from '@/features/polygon/components/DrawingAreaPanel';
import { PolygonMapGuard } from '@/features/polygon/components/PolygonMapGuard';
import { ResultAreaPanel } from '@/features/polygon/components/ResultAreaPanel';
import { usePolygonBoard } from '@/features/polygon/hooks/usePolygonBoard';
import '@/features/polygon/polygonBoard.css';

export function PolygonControlPage() {
  const board = usePolygonBoard();

  return (
    <PolygonMapGuard>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <DrawingAreaPanel board={board} />
        <ResultAreaPanel board={board} />
      </div>
    </PolygonMapGuard>
  );
}
