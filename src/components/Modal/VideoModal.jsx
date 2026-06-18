import { useEffect } from 'react';

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

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-meta">
            <span className="modal-cat">{course.category}</span>
            <span className="modal-dur"><i className="fa-solid fa-clock"></i>{course.duration}</span>
          </div>
          <button className="modal-close" onClick={onClose} title="閉じる">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div className="video-wrap">
          <iframe
            src={`https://www.youtube.com/embed/${course.youtubeId}?autoplay=1&rel=0`}
            title={course.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
        <div className="modal-footer">
          <h3 className="modal-title">{course.title}</h3>
          <p className="modal-desc">{course.description}</p>
          <div className="modal-tags">
            {(course.tags || []).map(t => <span key={t} className="tag">{t}</span>)}
          </div>
          <a href={course.url} target="_blank" rel="noopener noreferrer" className="modal-yt-link">
            <i className="fa-brands fa-youtube"></i> YouTubeで開く
          </a>
        </div>
      </div>
    </div>
  );
}
