import React, { useCallback } from 'react'
import { Play, ChevronRight } from 'lucide-react'
import { CATEGORIES, LEVELS, TYPES } from '../data/courses.js'
import { useProgress } from '../context/CourseProgressContext.jsx'

export default function CourseCard({ course, onClick }) {
  const category = CATEGORIES[course.category]
  const level = LEVELS[course.level]
  const type = TYPES[course.type]

  const { isFavorite, isCompleted, toggleFavorite, toggleCompleted } = useProgress()
  const fav = isFavorite(course.id)
  const done = isCompleted(course.id)

  const handleFavClick = useCallback(
    (e) => {
      e.stopPropagation()
      toggleFavorite(course.id)
    },
    [course.id, toggleFavorite]
  )

  const handleDoneClick = useCallback(
    (e) => {
      e.stopPropagation()
      toggleCompleted(course.id)
    },
    [course.id, toggleCompleted]
  )

  return (
    <article
      onClick={onClick}
      tabIndex={0}
      role="button"
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick()}
      aria-label={`${course.title}の詳細を見る`}
      className={`group relative bg-white dark:bg-gray-800 rounded-2xl shadow-card hover:shadow-card-hover hover:-translate-y-1.5 transition-all duration-300 cursor-pointer overflow-hidden border flex flex-col animate-fade-in ${
        done
          ? 'border-green-400/40 ring-2 ring-green-400/30 opacity-90'
          : 'border-gray-100 dark:border-gray-700'
      }`}
    >
      {/* Top gradient accent */}
      <div
        className="h-1.5 w-full flex-shrink-0"
        style={{ background: category?.gradient || '#6366f1' }}
        aria-hidden="true"
      />

      {/* 学習済みバッジ */}
      {done && (
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500 text-white text-xs font-bold shadow-sm select-none">
          <span aria-hidden="true">✓</span>
          学習済み
        </div>
      )}

      {/* お気に入りトグル（右上） */}
      <button
        onClick={handleFavClick}
        aria-pressed={fav}
        aria-label={fav ? 'お気に入りを解除' : 'お気に入りに追加'}
        className={`absolute top-3 right-3 z-10 flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 ${
          fav
            ? 'bg-rose-500 text-white shadow-md scale-110'
            : 'bg-white/80 dark:bg-gray-700/80 text-gray-400 hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30 hover:scale-110'
        }`}
        style={fav ? { animation: 'fav-pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)' } : undefined}
      >
        <span className="text-sm leading-none" aria-hidden="true">
          {fav ? '♥' : '♡'}
        </span>
      </button>

      {/* YouTube thumbnail */}
      {course.youtubeId && (
        <div className="relative overflow-hidden bg-gray-100 dark:bg-gray-700">
          <img
            src={`https://img.youtube.com/vi/${course.youtubeId}/hqdefault.jpg`}
            alt={`${course.title}のサムネイル`}
            className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          {/* Play overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
            <div
              className="flex items-center justify-center w-12 h-12 rounded-full bg-white/90 shadow-lg group-hover:scale-110 transition-transform"
              aria-hidden="true"
            >
              <Play size={20} fill="currentColor" style={{ color: category?.color || '#6366f1', marginLeft: 2 }} />
            </div>
          </div>
        </div>
      )}

      {/* Card body */}
      <div className="p-5 flex flex-col flex-1">
        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {/* Category chip */}
          {category && (
            <span
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
              style={{ background: category.accentSoft, color: category.color }}
            >
              <span aria-hidden="true">{category.emoji}</span>
              {category.label}
            </span>
          )}

          {/* Type chip */}
          {type && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
              {type.label}
            </span>
          )}

          {/* Level badge */}
          {level && (
            <span
              className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold text-white ml-auto"
              style={{ background: level.color }}
            >
              {level.label}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-bold text-base sm:text-lg text-ink dark:text-white mb-2 line-clamp-2 leading-snug">
          {course.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-3 flex-1 mb-4">
          {course.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between">
          {/* Done quick-toggle */}
          <button
            onClick={handleDoneClick}
            aria-pressed={done}
            aria-label={done ? '学習済みを解除' : '学習済みにする'}
            className={`flex items-center gap-1 text-xs font-medium rounded-full px-2.5 py-1 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400 ${
              done
                ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-400 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-500'
            }`}
          >
            <span className="text-sm" aria-hidden="true">{done ? '✓' : '○'}</span>
            {done ? '学習済み' : '未学習'}
          </button>

          <span
            className="flex items-center gap-1 text-xs font-semibold transition-all group-hover:gap-2"
            style={{ color: category?.color || '#6366f1' }}
          >
            くわしく見る
            <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>
      </div>

      {/* Hover accent border */}
      <div
        className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-opacity-30 transition-all pointer-events-none"
        style={{ borderColor: (category?.color || '#6366f1') + '33' }}
        aria-hidden="true"
      />
    </article>
  )
}
