export default function Sidebar({ currentView, onNavigate, sidebarOpen }) {
  const items = [
    { id: 'home',      icon: 'fa-solid fa-house',      label: 'ホーム',        section: 'メニュー' },
    { id: 'courses',   icon: 'fa-solid fa-book-open',   label: 'コース一覧',   section: null },
    { id: 'dashboard', icon: 'fa-solid fa-chart-pie',   label: 'ダッシュボード', section: null },
    { id: 'favorites', icon: 'fa-solid fa-heart',       label: 'お気に入り',   section: 'マイページ' },
    { id: 'bookmarks', icon: 'fa-solid fa-bookmark',    label: '保存済み',     section: null },
  ];

  return (
    <aside id="sidebar" className={sidebarOpen ? 'open' : ''}>
      <div className="sidebar-logo">
        <div className="logo-wrap">
          <div className="logo-icon"><i className="fa-solid fa-graduation-cap"></i></div>
          <div>
            <div className="logo-name">IT学習ポータル</div>
            <div className="logo-sub">情報大学 E-Learning</div>
          </div>
        </div>
      </div>
      <nav className="sidebar-nav">
        {items.map(item => (
          <div key={item.id}>
            {item.section && (
              <div className="nav-sec" style={item.id === 'favorites' ? { marginTop: '8px' } : {}}>{item.section}</div>
            )}
            <div
              className={`nav-item${currentView === item.id ? ' active' : ''}`}
              onClick={() => onNavigate(item.id)}
            >
              <div className="nicon"><i className={item.icon}></i></div>
              {item.label}
            </div>
          </div>
        ))}
      </nav>
      <div className="sidebar-foot">🔒 データはブラウザに保存<br />© 2026 情報大学</div>
    </aside>
  );
}
