// Contents.as의 slide()/backslide()/roll()은 결국 배열을 한 칸씩 순환시키는 것과 동일한 효과를
// 낸다(각 무비클립의 num을 ±1 하고 위치를 다시 배정). 여기서는 그 순환을 순수 함수로 표현한다.
export function rotateCarousel<T>(items: T[], steps: number): T[] {
  const len = items.length;
  if (len === 0) return [];
  const normalized = ((steps % len) + len) % len;
  return [...items.slice(normalized), ...items.slice(0, normalized)];
}
