import { useEffect } from 'react';
import { CATEGORIES, TYPES } from '../../data/courses';

export default function VideoModal({ course, onClose }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handler);
    };
  }, [onClose]);

  const cat = CATEGORIES[course.category] || { label: course.category, color: '#64748b' };
  const tp = TYPES[course.type] || { label: course.type, icon: 'fa-solid fa-circle', color: '#64748b' };
  const hasEmbed = Boolean(course.youtubeId);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-meta">
            <span className="modal-cat" style={{ color: cat.color }}>{cat.label}</span>
            <span className="modal-dur"><i className="fa-solid fa-clock"></i>{course.duration}</span>
          </div>
          <button className="modal-close" onClick={onClose} title="閉じる">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {hasEmbed ? (
          <div className="video-wrap">
            <iframe
              src={`https://www.youtube.com/embed/${course.youtubeId}?autoplay=1&rel=0`}
              title={course.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="modal-noembed">
            <div className="modal-noembed-icon" style={{ color: tp.color }}>
              <i className={tp.icon}></i>
            </div>
            <p className="modal-noembed-label">{tp.label}</p>
            <a
              href={course.url}
              className={`modal-open-btn${course.type === 'youtube' ? ' yt' : ''}`}
            >
              {course.type === 'youtube' ? (
                <><i className="fa-brands fa-youtube"></i>YouTubeで視聴（このタブ）</>
              ) : (
                <><i className="fa-solid fa-arrow-right"></i>このタブで開く</>
              )}
            </a>
          </div>
        )}

        <div className="modal-footer">
          <h3 className="modal-title">{course.title}</h3>
          <p className="modal-desc">{course.description}</p>
          <div className="modal-tags">
            {(course.tags || []).map(t => <span key={t} className="tag">{t}</span>)}
          </div>
          {hasEmbed && (
            <a href={course.url} className="modal-yt-link">
              <i className="fa-brands fa-youtube"></i> YouTubeで開く
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
