// `mz.utils.ArrayUtil.shuffle`와 동일한 용도: 갤러리 썸네일 등장/퇴장 순서를 무작위로 섞는다.
export function shuffleArray<T>(
  items: T[],
  random: () => number = Math.random,
): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
