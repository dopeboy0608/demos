// Main.as의 buy_btn/map_btn/story_btn(story.btn1/btn2) 그대로: 표시만, 클릭 동작 없음.
export function VoninLinkButtons() {
  return (
    <div className="vonin-link-buttons">
      <span className="vonin-link-button">구입안내</span>
      <span className="vonin-link-button">프로덕트맵</span>
      <span className="vonin-link-button">보닌 스토리 1</span>
      <span className="vonin-link-button">보닌 스토리 2</span>
    </div>
  );
}
