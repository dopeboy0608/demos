// Noticeboard.as/BestInfo.as/Best.as/Bm.as/Rss.as/Qa.as의 말줄임 로직을 그대로 옮긴 공용 함수.
// 각 영역마다 글자 수 제한과 말줄임 기호("..." 또는 "..")가 다르다.
export function truncateText(
  text: string,
  maxLength: number,
  ellipsis: string = '...',
): string {
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + ellipsis;
  }
  return text;
}
