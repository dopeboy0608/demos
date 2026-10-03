import { PolygonMapGuard } from '@/features/polygon/components/PolygonMapGuard';
import { PolygonMapPanel } from '@/features/polygon/components/PolygonMapPanel';
import { PolygonToolbar } from '@/features/polygon/components/PolygonToolbar';
import { usePolygonMapPanel } from '@/features/polygon/hooks/usePolygonMapPanel';
import type { PanelId } from '@/features/polygon/helper/types';

function PolygonPanelSection({ panelId }: { panelId: PanelId }) {
  const {
    panel,
    startDrawing,
    cancelDrawing,
    applyOperation,
    startSplitting,
    cancelSplitting,
    deleteSelected,
    clearAll,
  } = usePolygonMapPanel(panelId);

  return (
    <section
      style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}
    >
      <PolygonToolbar
        drawingMode={panel.drawingMode}
        onToggleDrawing={panel.drawingMode ? cancelDrawing : startDrawing}
        splitMode={panel.splitMode}
        onToggleSplit={panel.splitMode ? cancelSplitting : startSplitting}
        selectedCount={panel.selectedIds.length}
        polygonCount={panel.polygons.length}
        onApplyOperation={applyOperation}
        onDeleteSelected={deleteSelected}
        onClearAll={clearAll}
      />
      <PolygonMapPanel panelId={panelId} />
    </section>
  );
}

export function PolygonControlPage() {
  return (
    <PolygonMapGuard>
      <div style={{ display: 'flex', gap: 16 }}>
        <PolygonPanelSection panelId="left" />
        <PolygonPanelSection panelId="right" />
      </div>
    </PolygonMapGuard>
  );
}
