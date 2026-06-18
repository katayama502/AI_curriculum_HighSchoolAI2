import { useState } from 'react';
import { CATEGORIES, LEVELS, TYPES } from '../../data/courses';

export default function CourseCard({ course, isFav, isBk, prog, onToggleFav, onToggleBk, onSetProg, onTagClick, onToast }) {
  const [dropOpen, setDropOpen] = useState(false);

  const cat = CATEGORIES[course.category] || { label: course.category, icon: 'fa-circle', color: '#64748b' };
  const lv = LEVELS[course.level] || { label: course.level, color: '#64748b' };
  const tp = TYPES[course.type] || { label: course.type, icon: 'fa-solid fa-circle', color: '#64748b' };

  const progLabels = { none: '未着手', 'in-progress': '学習中', completed: '完了' };

  function handleFav(e) {
    e.stopPropagation();
    const added = onToggleFav(course.id);
    onToast(added ? '❤️ お気に入りに追加しました' : 'お気に入りから削除しました');
  }

  function handleBk(e) {
    e.stopPropagation();
    const added = onToggleBk(course.id);
    onToast(added ? '🔖 保存しました' : '保存を解除しました');
  }

  function handleProgClick(e) {
    e.stopPropagation();
    setDropOpen(v => !v);
  }

  function handleProgSet(e, s) {
    e.stopPropagation();
    onSetProg(course.id, s);
    setDropOpen(false);
    onToast(`進捗を「${progLabels[s]}」に更新しました`);
  }

  // Progress dot
  let progDot;
  if (prog === 'completed') {
    progDot = <span className="prog-dot done" title="完了"><i className="fa-solid fa-circle-check"></i></span>;
  } else if (prog === 'in-progress') {
    progDot = <span className="prog-dot wip" title="学習中"><i className="fa-solid fa-circle-half-stroke"></i></span>;
  } else {
    progDot = <span className="prog-dot none" title="未着手"><i className="fa-regular fa-circle"></i></span>;
  }

  // Top visual
  let topVisual;
  if (course.type === 'youtube' && course.youtubeId) {
    const thumbUrl = `https://img.youtube.com/vi/${course.youtubeId}/hqdefault.jpg`;
    topVisual = (
      <div className="card-thumb">
        <img
          src={thumbUrl}
          alt={course.title}
          loading="lazy"
          onError={e => { e.currentTarget.parentElement.classList.add('thumb-err'); e.currentTarget.style.display = 'none'; }}
        />
        <div className="thumb-overlay">
          <span className="thumb-duration">{course.duration || ''}</span>
        </div>
        <div className="thumb-play"><i className="fa-brands fa-youtube"></i></div>
        <div className="thumb-yt-badge"><i className="fa-brands fa-youtube"></i> YouTube</div>
      </div>
    );
  } else {
    const grad = `linear-gradient(135deg,${cat.color}22,${cat.color}44)`;
    topVisual = (
      <div className="card-banner" style={{ background: grad }}>
        <div className="banner-icon" style={{ background: cat.color }}>
          <i className={`fa-solid ${cat.icon}`}></i>
        </div>
        <div className="banner-text">
          <div className="banner-cat">{cat.label}</div>
          <div className="banner-type"><i className={tp.icon}></i> {tp.label}</div>
        </div>
      </div>
    );
  }

  const metaNode = course.author
    ? <span><i className="fa-solid fa-pen-nib"></i>{course.author}</span>
    : <span><i className="fa-solid fa-tv"></i>{course.channel || ''}</span>;

  return (
    <div className={`card${prog === 'completed' ? ' opacity-75' : ''}`} data-id={course.id}>
      {topVisual}
      <div className="card-body">
        <div className="card-top">
          <span className="pill pill-level" style={{ background: `${lv.color}18`, color: lv.color, border: `1px solid ${lv.color}38` }}>{lv.label}</span>
          <span className="pill pill-type"><i className={tp.icon}></i>{tp.label}</span>
          {progDot}
        </div>
        <div className="card-cat" style={{ color: cat.color }}>{cat.label}</div>
        <h3 className="card-title">{course.title}</h3>
        <p className="card-desc">{course.description.slice(0, 88)}…</p>
        <div className="card-meta">
          {metaNode}
          {course.duration && <span><i className="fa-solid fa-clock"></i>{course.duration}</span>}
        </div>
        <div className="card-tags">
          {(course.tags || []).slice(0, 4).map(tag => (
            <span key={tag} className="tag" onClick={e => { e.stopPropagation(); onTagClick(tag); }}>{tag}</span>
          ))}
        </div>
      </div>
      <div className="card-foot">
        <button
          className={`act btn-fav${isFav ? ' fav-on' : ''}`}
          title="お気に入り"
          onClick={handleFav}
        >
          <i className={`fa-${isFav ? 'solid' : 'regular'} fa-heart`}></i>
        </button>
        <button
          className={`act btn-bk${isBk ? ' book-on' : ''}`}
          title="保存"
          onClick={handleBk}
        >
          <i className={`fa-${isBk ? 'solid' : 'regular'} fa-bookmark`}></i>
        </button>
        <div className="pmenu">
          <button className="act btn-prog" title="進捗" onClick={handleProgClick}>
            <i className="fa-solid fa-chart-simple"></i>
          </button>
          {dropOpen && (
            <div className="pdrop show">
              {['none', 'in-progress', 'completed'].map(s => (
                <button
                  key={s}
                  className={`popt${prog === s ? ' on' : ''}`}
                  onClick={e => handleProgSet(e, s)}
                >
                  {s === 'none' && <><i className="fa-regular fa-circle"></i>未着手</>}
                  {s === 'in-progress' && <><i className="fa-solid fa-circle-half-stroke"></i>学習中</>}
                  {s === 'completed' && <><i className="fa-solid fa-circle-check"></i>完了</>}
                </button>
              ))}
            </div>
          )}
        </div>
        <a href={course.url} target="_blank" rel="noopener noreferrer" className="open-btn">
          <i className="fa-solid fa-arrow-up-right-from-square"></i>開く
        </a>
      </div>
    </div>
  );
}
