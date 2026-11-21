const VERTEX_COUNT = 6;

// seed만으로 변주를 만드는 결정적 의사난수(실제 Math.random을 쓰지 않아 테스트 가능)
function pseudoRandom(seed: number, salt: number): number {
  const value = Math.sin(seed * 12.9898 + salt * 78.233) * 43758.5453;
  return value - Math.floor(value);
}

/**
 * 중심좌표 주변에 단순 사각형이 아닌 불규칙한 다각형을 만든다. 실제 난수 대신 seed 기반
 * 의사난수를 써서, 같은 center/seed면 항상 같은 모양이 나온다(mock fixture로 쓰기 위함).
 */
export function createNaturalPolygon(
  center: { lat: number; lng: number },
  seed: number,
  baseRadius = 0.02,
): number[][][][] {
  const points: number[][] = [];

  for (let i = 0; i < VERTEX_COUNT; i++) {
    const angle = (Math.PI * 2 * i) / VERTEX_COUNT;
    const radiusVariance = 0.6 + pseudoRandom(seed, i) * 0.5;
    const radius = baseRadius * radiusVariance;
    const lng = center.lng + radius * Math.cos(angle);
    const lat = center.lat + radius * Math.sin(angle) * 0.8;
    points.push([lng, lat]);
  }

  points.push(points[0]);

  return [[points]];
}
