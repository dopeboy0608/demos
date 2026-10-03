export type PanelId = 'left' | 'right';

export type PolygonSource =
  'drawn' | 'union' | 'intersection' | 'xor' | 'difference' | 'split';

export interface LatLng {
  lat: number;
  lng: number;
}

export interface Polygon {
  id: string;
  panelId: PanelId;
  path: LatLng[];
  selected: boolean;
  source: PolygonSource;
}

export interface MapPanelState {
  id: PanelId;
  drawingMode: boolean;
  splitMode: boolean;
  polygons: Polygon[];
  selectedIds: string[];
}
