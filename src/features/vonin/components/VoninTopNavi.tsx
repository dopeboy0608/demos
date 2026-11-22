import { VONIN_MENU_TREE } from '../helper/voninMenuData';

// TopNavi.as/TopNaviXML.as 그대로: menulink.xml의 3단계 메뉴 트리를 그대로 표시.
// 원본은 현재 위치를 강조하지만, 이 데모에는 서브 페이지 라우팅이 없어 강조 없이 트리만 표시한다.
export function VoninTopNavi() {
  return (
    <nav className="vonin-top-navi">
      {VONIN_MENU_TREE.map((menu) => (
        <div key={menu.label} className="vonin-top-navi-item">
          <span className="vonin-top-navi-label">{menu.label}</span>
          {menu.children && (
            <div className="vonin-top-navi-dropdown">
              {menu.children.map((child) => (
                <div
                  key={child.label}
                  className="vonin-top-navi-dropdown-group"
                >
                  <span className="vonin-top-navi-dropdown-label">
                    {child.label}
                  </span>
                  {child.children && (
                    <ul className="vonin-top-navi-dropdown-sub">
                      {child.children.map((grandchild) => (
                        <li key={grandchild.label}>{grandchild.label}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </nav>
  );
}
