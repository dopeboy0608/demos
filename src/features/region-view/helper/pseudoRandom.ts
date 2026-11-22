// seed만으로 변주를 만드는 결정적 의사난수(실제 Math.random을 쓰지 않아 테스트 가능).
// naturalPolygon.ts와 radialSubdivision.ts가 공유한다.
export function pseudoRandom(seed: number, salt: number): number {
  const value = Math.sin(seed * 12.9898 + salt * 78.233) * 43758.5453;
  return value - Math.floor(value);
}
