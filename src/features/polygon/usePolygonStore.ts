import { create } from 'zustand';

import {
  applyPolygonOperation,
  type OperationType,
} from './helper/polygonOperations';
import { splitPolygon } from './helper/polygonSplit';
import type {
  LatLng,
  MapPanelState,
  PanelId,
  Polygon,
  PolygonSource,
} from './helper/types';

const MIN_POLYGON_VERTICES = 3;

export interface OperationResult {
  ok: boolean;
  reason?: string;
}

function createEmptyPanel(id: PanelId): MapPanelState {
  return {
    id,
    drawingMode: false,
    splitMode: false,
    polygons: [],
    selectedIds: [],
  };
}

function createPolygonId(): string {
  return crypto.randomUUID();
}

interface PolygonStoreState {
  panels: Record<PanelId, MapPanelState>;
  setDrawingMode: (panelId: PanelId, drawingMode: boolean) => void;
  setSplitMode: (panelId: PanelId, splitMode: boolean) => void;
  addPolygon: (panelId: PanelId, path: LatLng[]) => void;
  toggleSelect: (panelId: PanelId, polygonId: string) => void;
  removePolygons: (panelId: PanelId, polygonIds: string[]) => void;
  replaceWithResult: (
    panelId: PanelId,
    removedIds: string[],
    paths: LatLng[][],
    source: PolygonSource,
  ) => void;
  applyOperation: (panelId: PanelId, type: OperationType) => OperationResult;
  applySplit: (panelId: PanelId, linePath: LatLng[]) => OperationResult;
}

export const usePolygonStore = create<PolygonStoreState>((set, get) => ({
  panels: {
    left: createEmptyPanel('left'),
    right: createEmptyPanel('right'),
  },

  setDrawingMode: (panelId, drawingMode) =>
    set((state) => ({
      panels: {
        ...state.panels,
        [panelId]: { ...state.panels[panelId], drawingMode },
      },
    })),

  setSplitMode: (panelId, splitMode) =>
    set((state) => ({
      panels: {
        ...state.panels,
        [panelId]: { ...state.panels[panelId], splitMode },
      },
    })),

  addPolygon: (panelId, path) =>
    set((state) => {
      if (path.length < MIN_POLYGON_VERTICES) {
        return state;
      }
      const newPolygon: Polygon = {
        id: createPolygonId(),
        panelId,
        path,
        selected: false,
        source: 'drawn',
      };
      const panel = state.panels[panelId];
      return {
        panels: {
          ...state.panels,
          [panelId]: { ...panel, polygons: [...panel.polygons, newPolygon] },
        },
      };
    }),

  toggleSelect: (panelId, polygonId) =>
    set((state) => {
      const panel = state.panels[panelId];
      const isSelected = panel.selectedIds.includes(polygonId);
      const selectedIds = isSelected
        ? panel.selectedIds.filter((id) => id !== polygonId)
        : [...panel.selectedIds, polygonId];
      const polygons = panel.polygons.map((polygon) =>
        polygon.id === polygonId
          ? { ...polygon, selected: !isSelected }
          : polygon,
      );
      return {
        panels: {
          ...state.panels,
          [panelId]: { ...panel, selectedIds, polygons },
        },
      };
    }),

  removePolygons: (panelId, polygonIds) =>
    set((state) => {
      const panel = state.panels[panelId];
      const removedSet = new Set(polygonIds);
      return {
        panels: {
          ...state.panels,
          [panelId]: {
            ...panel,
            polygons: panel.polygons.filter(
              (polygon) => !removedSet.has(polygon.id),
            ),
            selectedIds: panel.selectedIds.filter((id) => !removedSet.has(id)),
          },
        },
      };
    }),

  replaceWithResult: (panelId, removedIds, paths, source) =>
    set((state) => {
      const panel = state.panels[panelId];
      const removedSet = new Set(removedIds);
      const newPolygons: Polygon[] = paths
        .filter((path) => path.length >= MIN_POLYGON_VERTICES)
        .map((path) => ({
          id: createPolygonId(),
          panelId,
          path,
          selected: false,
          source,
        }));
      return {
        panels: {
          ...state.panels,
          [panelId]: {
            ...panel,
            polygons: [
              ...panel.polygons.filter(
                (polygon) => !removedSet.has(polygon.id),
              ),
              ...newPolygons,
            ],
            selectedIds: panel.selectedIds.filter((id) => !removedSet.has(id)),
          },
        },
      };
    }),

  applyOperation: (panelId, type) => {
    const panel = get().panels[panelId];
    // FR-006: 정확히 2개 선택된 경우에만 합치기 연산을 실행한다.
    if (panel.selectedIds.length !== 2) {
      return { ok: false, reason: '폴리곤을 정확히 2개 선택해야 합니다.' };
    }
    const [idA, idB] = panel.selectedIds;
    const polygonA = panel.polygons.find((polygon) => polygon.id === idA);
    const polygonB = panel.polygons.find((polygon) => polygon.id === idB);
    if (!polygonA || !polygonB) {
      return { ok: false, reason: '선택된 폴리곤을 찾을 수 없습니다.' };
    }
    const resultPaths = applyPolygonOperation(
      type,
      polygonA.path,
      polygonB.path,
    );
    if (resultPaths.length === 0) {
      return { ok: false, reason: '겹치는 영역이 없습니다.' };
    }
    get().replaceWithResult(panelId, [idA, idB], resultPaths, type);
    return { ok: true };
  },

  applySplit: (panelId, linePath) => {
    const panel = get().panels[panelId];
    // 분할은 정확히 1개 선택된 폴리곤에만 적용한다.
    if (panel.selectedIds.length !== 1) {
      return { ok: false, reason: '분할할 폴리곤을 1개 선택해야 합니다.' };
    }
    const [id] = panel.selectedIds;
    const polygon = panel.polygons.find((item) => item.id === id);
    if (!polygon) {
      return { ok: false, reason: '선택된 폴리곤을 찾을 수 없습니다.' };
    }
    const resultPaths = splitPolygon(polygon.path, linePath);
    if (resultPaths.length === 0) {
      return { ok: false, reason: '분할선이 폴리곤을 가로지르지 않습니다.' };
    }
    get().replaceWithResult(panelId, [id], resultPaths, 'split');
    return { ok: true };
  },
}));
