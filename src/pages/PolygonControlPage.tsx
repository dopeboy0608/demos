import {
  DrawingAreaHeader,
  DrawingAreaMap,
} from '@/features/polygon/components/DrawingAreaPanel';
import { PolygonMapGuard } from '@/features/polygon/components/PolygonMapGuard';
import {
  ResultAreaHeader,
  ResultAreaMap,
} from '@/features/polygon/components/ResultAreaPanel';
import { usePolygonBoard } from '@/features/polygon/hooks/usePolygonBoard';
import '@/features/polygon/polygonBoard.css';

export function PolygonControlPage() {
  const board = usePolygonBoard();

  return (
    <PolygonMapGuard>
      <div className="polygon-board-grid">
        <DrawingAreaHeader board={board} />
        <ResultAreaHeader board={board} />
        <DrawingAreaMap board={board} />
        <ResultAreaMap board={board} />
      </div>
    </PolygonMapGuard>
  );
}
