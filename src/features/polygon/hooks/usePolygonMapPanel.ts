import { useCallback } from 'react';
import { message } from 'antd';

import { usePolygonStore } from '../usePolygonStore';
import type { OperationType } from '../helper/polygonOperations';
import type { LatLng, PanelId } from '../helper/types';

export function usePolygonMapPanel(panelId: PanelId) {
  const panel = usePolygonStore((state) => state.panels[panelId]);
  const setDrawingMode = usePolygonStore((state) => state.setDrawingMode);
  const setSplitMode = usePolygonStore((state) => state.setSplitMode);
  const addPolygon = usePolygonStore((state) => state.addPolygon);
  const toggleSelect = usePolygonStore((state) => state.toggleSelect);
  const applyOperationAction = usePolygonStore((state) => state.applyOperation);
  const applySplitAction = usePolygonStore((state) => state.applySplit);
  const removePolygons = usePolygonStore((state) => state.removePolygons);

  const startDrawing = useCallback(
    () => setDrawingMode(panelId, true),
    [panelId, setDrawingMode],
  );
  const cancelDrawing = useCallback(
    () => setDrawingMode(panelId, false),
    [panelId, setDrawingMode],
  );

  const startSplitting = useCallback(
    () => setSplitMode(panelId, true),
    [panelId, setSplitMode],
  );
  const cancelSplitting = useCallback(
    () => setSplitMode(panelId, false),
    [panelId, setSplitMode],
  );

  const finishDrawing = useCallback(
    (path: LatLng[]) => {
      addPolygon(panelId, path);
      setDrawingMode(panelId, false);
    },
    [panelId, addPolygon, setDrawingMode],
  );

  const handleToggleSelect = useCallback(
    (polygonId: string) => toggleSelect(panelId, polygonId),
    [panelId, toggleSelect],
  );

  const applyOperation = useCallback(
    (type: OperationType) => {
      const result = applyOperationAction(panelId, type);
      if (!result.ok && result.reason) {
        message.warning(result.reason);
      }
    },
    [panelId, applyOperationAction],
  );

  const finishSplit = useCallback(
    (linePath: LatLng[]) => {
      const result = applySplitAction(panelId, linePath);
      if (!result.ok && result.reason) {
        message.warning(result.reason);
      }
      setSplitMode(panelId, false);
    },
    [panelId, applySplitAction, setSplitMode],
  );

  const deleteSelected = useCallback(
    () => removePolygons(panelId, panel.selectedIds),
    [panelId, panel.selectedIds, removePolygons],
  );

  const clearAll = useCallback(
    () =>
      removePolygons(
        panelId,
        panel.polygons.map((polygon) => polygon.id),
      ),
    [panelId, panel.polygons, removePolygons],
  );

  return {
    panel,
    startDrawing,
    cancelDrawing,
    finishDrawing,
    toggleSelect: handleToggleSelect,
    applyOperation,
    startSplitting,
    cancelSplitting,
    finishSplit,
    deleteSelected,
    clearAll,
  };
}
