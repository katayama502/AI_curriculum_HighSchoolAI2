import React, { useEffect, useRef, useState, useCallback } from 'react'
import { X, Play, CheckCircle2, Heart, ExternalLink } from 'lucide-react'
import { CATEGORIES, LEVELS, TYPES } from '../data/courses.js'
import { useProgress } from '../context/CourseProgressContext.jsx'

export default function CourseModal({ course, onClose }) {
  const [videoLoaded, setVideoLoaded] = useState(false)
  const overlayRef = useRef(null)
  const closeButtonRef = useRef(null)
  const modalRef = useRef(null)

  const category = CATEGORIES[course.category]
  const level = LEVELS[course.level]
  const type = TYPES[course.type]

  const { isFavorite, isCompleted, toggleFavorite, toggleCompleted } = useProgress()
  const fav = isFavorite(course.id)
  const done = isCompleted(course.id)

  const [btnScale, setBtnScale] = useState({ fav: false, done: false })

  const animateBtn = useCallback((which) => {
    setBtnScale((s) => ({ ...s, [which]: true }))
    setTimeout(() => setBtnScale((s) => ({ ...s, [which]: false })), 300)
  }, [])

  const handleFav = useCallback(() => {
    toggleFavorite(course.id)
    animateBtn('fav')
  }, [course.id, toggleFavorite, animateBtn])

  const handleDone = useCallback(() => {
    toggleCompleted(course.id)
    animateBtn('done')
  }, [course.id, toggleCompleted, animateBtn])

  // Focus trap + Esc
  useEffect(() => {
    const prev = document.activeElement
    closeButtonRef.current?.focus()

    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()

      // Focus trap
      if (e.key === 'Tab') {
        const focusable = modalRef.current?.querySelectorAll(
          'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
        )
        if (!focusable || focusable.length === 0) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKey)

    // Body scroll lock
    const scrollY = window.scrollY
    document.body.style.overflow = 'hidden'
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollY}px`
    document.body.style.width = '100%'

    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      window.scrollTo(0, scrollY)
      prev?.focus()
    }
  }, [onClose])

  const handleOverlayClick = useCallback(
    (e) => {
      if (e.target === overlayRef.current) onClose()
    },
    [onClose]
  )

  const accentColor = category?.color || '#6366f1'
  const accentSoft = category?.accentSoft || '#eef2ff'
  const gradient = category?.gradient || 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'

  // Determine media display:
  // - Has youtubeId → lazy YouTube embed (click thumbnail → iframe)
  // - type=youtube but no youtubeId → YouTube search link (same tab)
  // - type=article/paper/course → external link (same tab)
  const hasEmbed = Boolean(course.youtubeId)
  const isYouTubeLink = course.type === 'youtube' && !hasEmbed
  const isExternalLink = course.type === 'article' || course.type === 'paper' || course.type === 'course'

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-2xl my-auto bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden animate-modal-in modal-scroll"
        style={{ maxHeight: '90vh', overflowY: 'auto' }}
      >
        {/* Top gradient accent */}
        <div
          className="h-2 w-full flex-shrink-0"
          style={{ background: gradient }}
          aria-hidden="true"
        />

        {/* Close button */}
        <button
          ref={closeButtonRef}
          onClick={onClose}
          aria-label="閉じる"
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200 transition-all"
        >
          <X size={18} />
        </button>

        {/* Content */}
        <div className="p-6 sm:p-8">
          {/* Header meta */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {category && (
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold"
                style={{ background: accentSoft, color: accentColor }}
              >
                <span aria-hidden="true">{category.emoji}</span>
                {category.label}
              </span>
            )}
            {type && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                {type.label}
              </span>
            )}
            {level && (
              <span
                className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold text-white"
                style={{ background: level.color }}
              >
                {level.label}
              </span>
            )}
          </div>

          {/* Title */}
          <h2
            id="modal-title"
            className="font-bold text-2xl sm:text-3xl text-ink dark:text-white mb-4 leading-tight"
          >
            {course.title}
          </h2>

          {/* Description */}
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6 text-base">
            {course.description}
          </p>

          {/* Duration + channel/author */}
          <div className="flex flex-wrap gap-4 mb-6 text-sm text-gray-500 dark:text-gray-400">
            {course.duration && (
              <span className="flex items-center gap-1">
                <span aria-hidden="true">⏱</span>
                {course.duration}
              </span>
            )}
            {course.channel && (
              <span className="flex items-center gap-1">
                <span aria-hidden="true">📺</span>
                {course.channel}
              </span>
            )}
            {course.author && (
              <span className="flex items-center gap-1">
                <span aria-hidden="true">✍️</span>
                {course.author}
              </span>
            )}
            {course.year && (
              <span className="flex items-center gap-1">
                <span aria-hidden="true">📅</span>
                {course.year}年
              </span>
            )}
          </div>

          {/* YouTube embed – lazy */}
          {hasEmbed && (
            <div className="mb-8">
              {!videoLoaded ? (
                <button
                  onClick={() => setVideoLoaded(true)}
                  className="relative w-full rounded-2xl overflow-hidden group focus:outline-none focus:ring-2 focus:ring-offset-2"
                  style={{ aspectRatio: '16/9' }}
                  aria-label={`${course.title}の動画を再生`}
                >
                  <img
                    src={`https://img.youtube.com/vi/${course.youtubeId}/hqdefault.jpg`}
                    alt={`${course.title}のサムネイル`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white/90 shadow-xl group-hover:scale-110 transition-transform">
                      <Play
                        size={28}
                        fill="currentColor"
                        style={{ color: accentColor, marginLeft: 3 }}
                      />
                    </div>
                  </div>
                  <div
                    className="absolute bottom-3 left-3 right-3 flex items-center gap-2 rounded-xl px-3 py-2"
                    style={{ background: accentSoft + 'dd' }}
                  >
                    <Play size={12} style={{ color: accentColor }} fill="currentColor" />
                    <span className="text-xs font-semibold" style={{ color: accentColor }}>
                      クリックして動画を再生
                    </span>
                  </div>
                </button>
              ) : (
                <div
                  className="w-full rounded-2xl overflow-hidden"
                  style={{ aspectRatio: '16/9' }}
                >
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${course.youtubeId}?autoplay=1&rel=0`}
                    title={course.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    loading="lazy"
                    className="w-full h-full"
                  />
                </div>
              )}
            </div>
          )}

          {/* Tags as keywords */}
          {course.tags && course.tags.length > 0 && (
            <div className="mb-6">
              <h3 className="font-bold text-base text-ink dark:text-white mb-3 flex items-center gap-2">
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs text-white font-bold flex-shrink-0"
                  style={{ background: accentColor }}
                  aria-hidden="true"
                >
                  🔑
                </span>
                学習キーワード
              </h3>
              <div className="flex flex-wrap gap-2">
                {course.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium"
                    style={{ background: accentSoft, color: accentColor }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* CTA row */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
            {/* YouTube link (no youtubeId, type=youtube) – same tab */}
            {isYouTubeLink && course.url && (
              <a
                href={course.url}
                className="flex items-center justify-center gap-2 flex-1 py-3.5 rounded-2xl text-white font-bold text-base transition-all hover:-translate-y-0.5 hover:shadow-lg"
                style={{ background: 'linear-gradient(135deg, #ff0000 0%, #cc0000 100%)' }}
              >
                <span aria-hidden="true">▶</span>
                YouTubeで見る
              </a>
            )}

            {/* Article / paper / course link – same tab */}
            {isExternalLink && course.url && (
              <a
                href={course.url}
                className="flex items-center justify-center gap-2 flex-1 py-3.5 rounded-2xl text-white font-bold text-base transition-all hover:-translate-y-0.5 hover:shadow-lg"
                style={{ background: gradient }}
              >
                このタブで開く
                <ExternalLink size={16} />
              </a>
            )}

            {/* Favorites toggle */}
            <button
              onClick={handleFav}
              aria-pressed={fav}
              aria-label={fav ? 'お気に入りを解除' : 'お気に入りに追加'}
              className={`flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl font-bold text-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 ${
                btnScale.fav ? 'scale-95' : 'hover:scale-105'
              } ${
                fav
                  ? 'bg-rose-500 text-white shadow-md'
                  : 'bg-rose-50 dark:bg-rose-900/20 text-rose-500 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/30'
              }`}
              style={{ transition: 'transform 0.2s cubic-bezier(0.34,1.56,0.64,1), background 0.2s' }}
            >
              <Heart size={16} fill={fav ? 'currentColor' : 'none'} />
              {fav ? 'お気に入り中' : 'お気に入り'}
            </button>

            {/* Completed toggle */}
            <button
              onClick={handleDone}
              aria-pressed={done}
              aria-label={done ? '学習済みを解除' : '学習済みにする'}
              className={`flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl font-bold text-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400 ${
                btnScale.done ? 'scale-95' : 'hover:scale-105'
              } ${
                done
                  ? 'bg-green-500 text-white shadow-md'
                  : 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30'
              }`}
              style={{ transition: 'transform 0.2s cubic-bezier(0.34,1.56,0.64,1), background 0.2s' }}
            >
              <CheckCircle2 size={16} />
              {done ? '学習済み（解除）' : '学習済みにする'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
