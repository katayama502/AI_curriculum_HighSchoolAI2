import React, { useEffect, useRef, useState, useCallback } from 'react'
import { COURSES, CATEGORIES } from '../data/courses.js'
import { useProgress } from '../context/CourseProgressContext.jsx'

const TOTAL = COURSES.length

// Category breakdown config
const CATEGORY_CONFIG = Object.entries(CATEGORIES).map(([key, cat]) => ({
  id: key,
  label: cat.label,
  emoji: cat.emoji,
  color: cat.color,
  gradient: cat.gradient,
  total: COURSES.filter((c) => c.category === key).length,
}))

function getMilestone(pct) {
  if (pct === 0) return { text: '最初のカードを学んでみよう', emoji: '🌱' }
  if (pct <= 40) return { text: 'いいスタート！この調子', emoji: '🚀' }
  if (pct <= 80) return { text: '順調！折り返し地点を突破', emoji: '💪' }
  if (pct < 100) return { text: 'ゴールはすぐそこ', emoji: '✨' }
  return { text: '全コース制覇！おめでとう', emoji: '🎉' }
}

// Smooth count-up hook
function useCountUp(target, duration = 600) {
  const [value, setValue] = useState(0)
  const rafRef = useRef(null)

  useEffect(() => {
    const start = performance.now()
    const from = 0

    const animate = (now) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(from + (target - from) * eased))
      if (progress < 1) rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [target, duration])

  return value
}

// Ring component
function ProgressRing({ pct, completedCount }) {
  const RADIUS = 64
  const STROKE = 10
  const SIZE = (RADIUS + STROKE) * 2
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS

  const [offset, setOffset] = useState(CIRCUMFERENCE)
  const animatedPct = useCountUp(pct, 700)
  const animatedCount = useCountUp(completedCount, 700)
  const is100 = pct === 100

  useEffect(() => {
    const timeout = setTimeout(() => {
      setOffset(CIRCUMFERENCE - (pct / 100) * CIRCUMFERENCE)
    }, 100)
    return () => clearTimeout(timeout)
  }, [pct, CIRCUMFERENCE])

  return (
    <div className="relative flex items-center justify-center" style={{ width: SIZE, height: SIZE }}>
      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className={`-rotate-90 ${is100 ? 'drop-shadow-[0_0_12px_rgba(99,102,241,0.6)]' : ''}`}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="40%" stopColor="#0ea5e9" />
            <stop offset="80%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
        {/* Track */}
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="currentColor"
          strokeWidth={STROKE}
          className="text-gray-100 dark:text-gray-700/60"
        />
        {/* Arc */}
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="url(#ring-grad)"
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
        />
      </svg>

      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`font-jakarta font-extrabold text-3xl leading-none ${is100 ? 'text-indigo-500' : 'text-ink dark:text-white'}`}>
          {animatedPct}%
        </span>
        <span className="text-xs text-gray-400 dark:text-gray-500 mt-1 font-medium">
          {animatedCount} / {TOTAL}
        </span>
        <span className="text-xs text-gray-400 dark:text-gray-500 leading-none">
          学習済み
        </span>
      </div>
    </div>
  )
}

// Category breakdown bar
function CategoryBar({ config, done, total }) {
  const pct = total > 0 ? Math.round((done / total) * 100) : 0
  const [width, setWidth] = useState(0)
  const animatedDone = useCountUp(done, 500)

  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), 150)
    return () => clearTimeout(t)
  }, [pct])

  return (
    <div className="flex items-center gap-3">
      <span className="text-base w-6 text-center flex-shrink-0" aria-hidden="true">{config.emoji}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 truncate">
            {config.label}
          </span>
          <span className="text-xs font-bold ml-2 flex-shrink-0" style={{ color: config.color }}>
            {animatedDone}/{total}
          </span>
        </div>
        <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-700/60 overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              width: `${width}%`,
              background: config.gradient,
              transition: 'width 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default function ProgressDashboard({ onFavoritesFilter }) {
  const { completed, favorites, resetAll } = useProgress()

  const completedCount = completed.size
  const favoritesCount = favorites.size
  const pct = TOTAL > 0 ? Math.round((completedCount / TOTAL) * 100) : 0
  const milestone = getMilestone(pct)
  const is100 = pct === 100

  const handleFavClick = useCallback(() => {
    onFavoritesFilter?.()
    document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' })
  }, [onFavoritesFilter])

  return (
    <section
      id="progress-dashboard"
      className="py-10 px-4 sm:px-6"
      aria-label="学習進捗ダッシュボード"
    >
      <div className="max-w-6xl mx-auto">
        {/* Panel */}
        <div className="relative rounded-3xl overflow-hidden shadow-card-hover border border-gray-100 dark:border-gray-700/50">
          {/* Subtle gradient bg decoration */}
          <div
            className="absolute inset-0 opacity-5 dark:opacity-10 pointer-events-none"
            style={{
              background: 'conic-gradient(from 135deg at 20% 50%, #6366f1 0deg, #0ea5e9 90deg, #10b981 180deg, #8b5cf6 270deg, #6366f1 360deg)',
            }}
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-white/90 dark:bg-gray-900/90 pointer-events-none" />

          <div className="relative z-10 p-6 sm:p-8">
            {/* Section label */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="inline-block text-xs font-semibold tracking-wider uppercase text-gray-400 dark:text-gray-500 mb-1">
                  あなたの学習記録
                </span>
                <h2 className="font-jakarta font-extrabold text-xl sm:text-2xl text-ink dark:text-white leading-tight">
                  学習進捗ダッシュボード
                </h2>
              </div>

              {/* Milestone badge */}
              <div
                className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold shadow-sm border ${
                  is100
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-transparent animate-pulse'
                    : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-100 dark:border-gray-700'
                }`}
              >
                <span aria-hidden="true">{milestone.emoji}</span>
                <span>{milestone.text}</span>
              </div>
            </div>

            {/* Main grid: ring left, bars right */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">
              {/* Ring */}
              <div className="flex flex-col items-center gap-4">
                <ProgressRing pct={pct} completedCount={completedCount} />

                {/* Mobile milestone */}
                <div
                  className={`sm:hidden flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${
                    is100
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                      : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
                  }`}
                >
                  <span aria-hidden="true">{milestone.emoji}</span>
                  <span>{milestone.text}</span>
                </div>
              </div>

              {/* Right column */}
              <div className="space-y-4">
                {/* Category bars */}
                <div className="space-y-2">
                  {CATEGORY_CONFIG.map((cc) => {
                    const done = COURSES
                      .filter((c) => c.category === cc.id)
                      .filter((c) => completed.has(c.id)).length
                    return (
                      <CategoryBar key={cc.id} config={cc} done={done} total={cc.total} />
                    )
                  })}
                </div>

                {/* Divider */}
                <div className="border-t border-gray-100 dark:border-gray-700/60 pt-4 flex flex-wrap items-center gap-3">
                  {/* Favorites chip */}
                  <button
                    onClick={handleFavClick}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-semibold transition-all hover:scale-105 active:scale-95"
                    style={{
                      background: favoritesCount > 0 ? '#FFF1F2' : '#F3F4F6',
                      color: favoritesCount > 0 ? '#E11D48' : '#9CA3AF',
                    }}
                    aria-label={`お気に入り ${favoritesCount} 件。クリックでフィルタ`}
                  >
                    <span aria-hidden="true">{favoritesCount > 0 ? '♥' : '♡'}</span>
                    <span>{favoritesCount} 件のお気に入り</span>
                  </button>

                  {/* Reset */}
                  <button
                    onClick={resetAll}
                    className="text-xs text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400 transition-colors ml-auto"
                    aria-label="お気に入りと学習進捗をリセット"
                  >
                    進捗をリセット
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
