import { useState } from 'react';

export default function Header({ query, onSearch, onMenuClick, totalCourses }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  function handleMobileToggle() {
    setMobileOpen(v => !v);
  }

  return (
    <>
      <header className="header">
        <button id="menu-btn" aria-label="メニュー" onClick={onMenuClick}>
          <i className="fa-solid fa-bars"></i>
        </button>
        <div className="search-wrap">
          <i className="fa-solid fa-magnifying-glass si"></i>
          <input
            type="search"
            placeholder="キーワード・タグで検索…"
            autoComplete="off"
            spellCheck="false"
            value={query}
            onChange={e => onSearch(e.target.value)}
          />
        </div>
        <div className="header-right">
          <button
            id="search-toggle-btn"
            aria-label="検索"
            className={mobileOpen ? 'active' : ''}
            onClick={handleMobileToggle}
          >
            <i className="fa-solid fa-magnifying-glass"></i>
          </button>
          <div className="hpill">
            <i className="fa-solid fa-book-open"></i>
            <span className="pill-txt">全 {totalCourses} コース</span>
          </div>
        </div>
      </header>
      {mobileOpen && (
        <div className="mobile-search open">
          <div className="search-wrap">
            <i className="fa-solid fa-magnifying-glass si"></i>
            <input
              type="search"
              placeholder="キーワード・タグで検索…"
              autoComplete="off"
              spellCheck="false"
              value={query}
              onChange={e => onSearch(e.target.value)}
              autoFocus
            />
          </div>
        </div>
      )}
    </>
  );
}
