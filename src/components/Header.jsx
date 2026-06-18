import React, { useState, useEffect, useCallback } from 'react'
import { Moon, Sun, Menu, X } from 'lucide-react'
import { CATEGORIES } from '../data/courses.js'

// Mini ring SVG for the header chip
function MiniRing({ pct }) {
  const RADIUS = 9
  const STROKE = 2.5
  const SIZE = (RADIUS + STROKE) * 2
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS
  const offset = CIRCUMFERENCE - (pct / 100) * CIRCUMFERENCE

  return (
    <svg
      width={SIZE}
      height={SIZE}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      className="-rotate-90 flex-shrink-0"
      aria-hidden="true"
    >
      <circle
        cx={SIZE / 2}
        cy={SIZE / 2}
        r={RADIUS}
        fill="none"
        stroke="currentColor"
        strokeWidth={STROKE}
        className="text-gray-200 dark:text-gray-700"
      />
      <circle
        cx={SIZE / 2}
        cy={SIZE / 2}
        r={RADIUS}
        fill="none"
        stroke="url(#mini-ring-grad)"
        strokeWidth={STROKE}
        strokeLinecap="round"
        strokeDasharray={CIRCUMFERENCE}
        strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 0.6s ease' }}
      />
      <defs>
        <linearGradient id="mini-ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="50%" stopColor="#0ea5e9" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
      </defs>
    </svg>
  )
}

const NAV_CATEGORIES = ['basics', 'programming', 'ai_ml', 'security', 'cloud']

export default function Header({ isDark, onToggleDark, completedCount = 0, totalCount = 1 }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleScrollToDashboard = useCallback((e) => {
    e.preventDefault()
    document.getElementById('progress-dashboard')?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }, [])

  const navItems = NAV_CATEGORIES.map((key) => ({
    key,
    label: CATEGORIES[key].label,
    emoji: CATEGORIES[key].emoji,
    href: '#gallery',
  }))

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 dark:bg-gray-950/90 backdrop-blur-md shadow-sm border-b border-gray-100 dark:border-gray-800'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <a
          href="#top"
          className="flex items-center gap-2 group"
          onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
        >
          <span className="text-xl sm:text-2xl" role="img" aria-label="ロゴ">🖥️</span>
          <span className="font-jakarta font-bold text-base sm:text-lg text-ink dark:text-white leading-tight tracking-tight group-hover:opacity-80 transition-opacity">
            IT学習ポータル
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1" aria-label="メインナビ">
          {navItems.map((item) => (
            <a
              key={item.key}
              href={item.href}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-ink dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              <span aria-hidden="true">{item.emoji}</span>
              {item.label}
            </a>
          ))}
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          {/* Progress chip – desktop */}
          <button
            onClick={handleScrollToDashboard}
            aria-label={`学習進捗 ${pct}%。クリックでダッシュボードへ`}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-xs font-semibold text-gray-600 dark:text-gray-300 transition-all hover:scale-105"
          >
            <MiniRing pct={pct} />
            <span>学習 {pct}%</span>
          </button>

          <button
            onClick={onToggleDark}
            aria-label={isDark ? 'ライトモードに切り替え' : 'ダークモードに切り替え'}
            className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-200 transition-all"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            className="md:hidden p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="メニュー"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-white/95 dark:bg-gray-950/95 backdrop-blur-md border-t border-gray-100 dark:border-gray-800 px-4 pb-4 pt-2">
          {/* Progress chip mobile */}
          <button
            onClick={handleScrollToDashboard}
            className="w-full flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800/60 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors mb-2"
          >
            <MiniRing pct={pct} />
            <span>学習進捗</span>
            <span className="ml-auto font-bold text-indigo-500">{pct}%</span>
          </button>

          <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-widest px-1 mb-1.5">
            カテゴリへジャンプ
          </p>
          <div className="grid grid-cols-2 gap-1.5">
            {navItems.map((item) => (
              <a
                key={item.key}
                href={item.href}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/60 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={(e) => {
                  e.preventDefault()
                  setMenuOpen(false)
                  document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                <span aria-hidden="true" className="text-base">{item.emoji}</span>
                <span className="truncate">{item.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}
