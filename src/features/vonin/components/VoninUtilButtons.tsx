// Main.as의 login/join/center/sitemap/contact/info/security 버튼 그대로: 표시만, 클릭 동작 없음
// (결정 사항 ③).
const UTIL_BUTTON_LABELS = [
  'LOGIN',
  'JOIN',
  'CENTER',
  'SITEMAP',
  'CONTACT',
  'INFO',
  'SECURITY',
];

export function VoninUtilButtons() {
  return (
    <div className="vonin-util-buttons">
      {UTIL_BUTTON_LABELS.map((label) => (
        <span key={label} className="vonin-util-button">
          {label}
        </span>
      ))}
    </div>
  );
}
