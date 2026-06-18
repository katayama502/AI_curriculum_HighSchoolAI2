import { CATEGORIES } from '../../data/courses';

export default function FilterBar({ cat, level, type, onCat, onLevel, onType, resultCount, examOnly, onExamToggle }) {
  return (
    <div className="filter-panel">
      <div className="filter-inner">
        <div className="frow">
          <span className="flabel">カテゴリー</span>
          <div className="chips">
            <button
              className={`chip${cat === 'all' ? ' on' : ''}`}
              onClick={() => onCat('all')}
            >すべて</button>
            {Object.entries(CATEGORIES).map(([key, c]) => (
              <button
                key={key}
                className={`chip${cat === key ? ' on' : ''}`}
                style={{ '--cc': c.color }}
                onClick={() => onCat(key)}
              >
                <i className={`fa-solid ${c.icon}`}></i>{c.label}
              </button>
            ))}
          </div>
        </div>
        <div className="frow">
          <span className="flabel">レベル</span>
          <div className="chips">
            {[['all','すべて'],['beginner','🌱 初学者'],['intermediate','🔥 中級者'],['advanced','🚀 上級者']].map(([v,lbl]) => (
              <button key={v} className={`chip${level === v ? ' on' : ''}`} data-lf={v} onClick={() => onLevel(v)}>{lbl}</button>
            ))}
          </div>
          <span className="flabel" style={{ marginLeft: '12px' }}>タイプ</span>
          <div className="chips">
            <button
              className={`chip exam-chip${examOnly ? ' active' : ''}`}
              onClick={() => onExamToggle(!examOnly)}
            >
              <i className="fa-solid fa-graduation-cap"></i> 試験対策
            </button>
            <button className={`chip${type === 'all' ? ' on' : ''}`} onClick={() => onType('all')}>すべて</button>
            <button className={`chip${type === 'youtube' ? ' on' : ''}`} onClick={() => onType('youtube')}><i className="fa-brands fa-youtube"></i>YouTube</button>
            <button className={`chip${type === 'paper' ? ' on' : ''}`} onClick={() => onType('paper')}><i className="fa-solid fa-file-lines"></i>論文</button>
            <button className={`chip${type === 'article' ? ' on' : ''}`} onClick={() => onType('article')}><i className="fa-solid fa-book-open"></i>記事</button>
          </div>
        </div>
      </div>
    </div>
  );
}
