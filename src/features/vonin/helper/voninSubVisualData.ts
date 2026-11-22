// VONIN_Sub_visual1~5.swf는 컴파일된 SWF(디컴파일 도구 미설치)라 실제 텍스트/이미지를 추출할 수
// 없음. 5종 모두 스프라이트/셰이프 구성이 동일한 템플릿이라는 사실조사 결과에 따라, menulink.xml의
// Product 하위 메뉴 이름을 그대로 가상 콘텐츠로 사용한다(결정 사항: 가상의 서브 페이지 목업 배치).
export interface VoninSubVisual {
  id: number;
  title: string;
}

export const VONIN_SUB_VISUALS: VoninSubVisual[] = [
  { id: 1, title: 'Majesta' },
  { id: 2, title: 'The Sprit' },
  { id: 3, title: 'Vonin Rx II' },
  { id: 4, title: "NY'Z" },
  { id: 5, title: 'The Style' },
];
