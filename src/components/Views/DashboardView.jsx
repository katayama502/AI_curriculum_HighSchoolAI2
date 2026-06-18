import { COURSES, CATEGORIES } from '../../data/courses';
import CardGrid from '../Cards/CardGrid';

export default function DashboardView({ userData, onToggleFav, onToggleBk, onSetProg, onTagClick, onToast, onPlay }) {
  const { data, getProg, isFav, isBk } = userData;
  const total = COURSES.length;
  const done = Object.values(data.prog).filter(v => v === 'completed').length;
  const wip = Object.values(data.prog).filter(v => v === 'in-progress').length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  const circumference = 2 * Math.PI * 54;
  const offset = circumference * (1 - pct / 100);

  const recentCourses = COURSES.filter(c => getProg(c.id) !== 'none').slice(0, 6);

  return (
    <div className="view">
      <div className="ph">
        <h1 className="page-title">ダッシュボード</h1>
        <p>あなたの学習進捗・お気に入り・保存状況を一目で確認</p>
      </div>
      <div className="dash-top">
        <div className="dpanel">
          <div className="dpanel-title"><i className="fa-solid fa-chart-pie"></i>総合進捗</div>
          <div className="ring-wrap">
            <div style={{ position: 'relative' }}>
              <svg className="ring-svg" width="128" height="128" viewBox="0 0 128 128">
                <defs>
                  <linearGradient id="rg" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#38bdf8" />
                    <stop offset="100%" stopColor="#818cf8" />
                  </linearGradient>
                </defs>
                <circle cx="64" cy="64" r="54" fill="none" stroke="var(--border)" strokeWidth="11" />
                <circle
                  cx="64" cy="64" r="54" fill="none"
                  stroke="url(#rg)" strokeWidth="11"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset .9s cubic-bezier(.4,0,.2,1)' }}
                />
              </svg>
              <div className="ring-center">
                <div className="ring-pct">{pct}%</div>
                <div className="ring-lbl">完了率</div>
              </div>
            </div>
            <div className="mini-stats">
              <div className="mstat hi"><div className="mn">{done}</div><div className="ml">完了</div></div>
              <div className="mstat"><div className="mn">{wip}</div><div className="ml">学習中</div></div>
              <div className="mstat"><div className="mn">{data.fav.length}</div><div className="ml">お気に入り</div></div>
              <div className="mstat"><div className="mn">{data.bk.length}</div><div className="ml">保存済み</div></div>
            </div>
            <div className="total-note">全 <span>{total}</span> コース中</div>
          </div>
        </div>
        <div className="dpanel">
          <div className="dpanel-title"><i className="fa-solid fa-bars-progress"></i>カテゴリー別進捗</div>
          <div className="cplist">
            {Object.entries(CATEGORIES).map(([key, cat]) => {
              const tc = COURSES.filter(c => c.category === key).length;
              const dc = COURSES.filter(c => c.category === key && getProg(c.id) === 'completed').length;
              const pc = tc > 0 ? Math.round((dc / tc) * 100) : 0;
              return (
                <div className="cpitem" key={key}>
                  <div className="cpico" style={{ background: `${cat.color}18`, color: cat.color }}>
                    <i className={`fa-solid ${cat.icon}`}></i>
                  </div>
                  <div className="cpinfo">
                    <div className="cpname">{cat.label}</div>
                    <div className="cpbar">
                      <div className="cpfill" style={{ width: `${pc}%`, background: cat.color }}></div>
                    </div>
                    <div className="cpnums">{dc} / {tc}</div>
                  </div>
                  <div className="cppct" style={{ color: cat.color }}>{pc}%</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="dpanel">
        <div className="dpanel-title"><i className="fa-solid fa-clock-rotate-left"></i>最近の学習</div>
        <div id="recent-grid" style={{ marginTop: '16px' }}>
          {recentCourses.length === 0 ? (
            <div className="empty">
              <div className="empty-ico"><i className="fa-solid fa-graduation-cap"></i></div>
              <p>まだ学習を始めていません。コース一覧から始めましょう！</p>
            </div>
          ) : (
            <CardGrid
              courses={recentCourses}
              userData={userData}
              onToggleFav={onToggleFav}
              onToggleBk={onToggleBk}
              onSetProg={onSetProg}
              onTagClick={onTagClick}
              onToast={onToast}
              onPlay={onPlay}
            />
          )}
        </div>
      </div>
    </div>
  );
}
