import React, { useState } from 'react'
import { Search, X, SlidersHorizontal, ChevronDown } from 'lucide-react'
import { CATEGORIES, LEVELS, TYPES } from '../data/courses.js'

const ALL_CATEGORIES = [
  { id: 'all', label: 'すべて', emoji: '📋', color: '#6B7280', accentSoft: '#F3F4F6' },
  ...Object.entries(CATEGORIES).map(([key, cat]) => ({
    id: key,
    label: cat.label,
    emoji: cat.emoji,
    color: cat.color,
    accentSoft: cat.accentSoft,
  })),
]

const LEVEL_OPTIONS = [
  { id: 'all', label: 'すべて' },
  ...Object.entries(LEVELS).map(([key, lv]) => ({ id: key, label: lv.label, color: lv.color })),
]

const TYPE_OPTIONS = [
  { id: 'all', label: 'すべて' },
  ...Object.entries(TYPES).map(([key, ty]) => ({ id: key, label: ty.label })),
]

export default function FilterBar({
  selectedCategory,
  selectedLevel,
  selectedType,
  searchQuery,
  onCategoryChange,
  onLevelChange,
  onTypeChange,
  onSearchChange,
  resultCount,
  showFavoritesOnly,
  onToggleFavorites,
  showUnlearnedOnly,
  onToggleUnlearned,
  onReset,
}) {
  const [filtersOpen, setFiltersOpen] = useState(false)

  const hasActiveFilter =
    selectedCategory !== 'all' ||
    selectedLevel !== 'all' ||
    selectedType !== 'all' ||
    searchQuery ||
    showFavoritesOnly ||
    showUnlearnedOnly

  const activeFilterCount = [
    selectedCategory !== 'all',
    selectedLevel !== 'all',
    selectedType !== 'all',
    showFavoritesOnly,
    showUnlearnedOnly,
  ].filter(Boolean).length

  const FilterPanels = () => (
    <>
      {/* Quick toggles: Favorites & Unlearned */}
      <div>
        <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
          クイック絞り込み
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={onToggleFavorites}
            aria-pressed={showFavoritesOnly}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 ${
              showFavoritesOnly
                ? 'bg-rose-500 text-white border-rose-500 shadow-sm'
                : 'bg-rose-50 dark:bg-rose-900/20 text-rose-500 dark:text-rose-400 border-transparent hover:bg-rose-100 dark:hover:bg-rose-900/30'
            }`}
          >
            <span aria-hidden="true">{showFavoritesOnly ? '♥' : '♡'}</span>
            お気に入り
          </button>

          <button
            onClick={onToggleUnlearned}
            aria-pressed={showUnlearnedOnly}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
              showUnlearnedOnly
                ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                : 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-transparent hover:bg-amber-100 dark:hover:bg-amber-900/30'
            }`}
          >
            <span aria-hidden="true">📖</span>
            未学習のみ
          </button>
        </div>
      </div>

      {/* Category filter */}
      <div>
        <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
          カテゴリで絞り込む
        </p>
        <div className="flex flex-wrap gap-2">
          {ALL_CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => onCategoryChange(cat.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border"
                style={
                  isActive
                    ? {
                        background: cat.color,
                        color: '#fff',
                        borderColor: cat.color,
                        boxShadow: `0 2px 8px ${cat.color}40`,
                      }
                    : {
                        background: cat.accentSoft || '#F3F4F6',
                        color: cat.color || '#6B7280',
                        borderColor: 'transparent',
                      }
                }
                aria-pressed={isActive}
              >
                <span aria-hidden="true">{cat.emoji}</span>
                {cat.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Level filter */}
      <div>
        <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
          レベルで絞り込む
        </p>
        <div className="flex flex-wrap gap-2">
          {LEVEL_OPTIONS.map((lv) => {
            const isActive = selectedLevel === lv.id
            return (
              <button
                key={lv.id}
                onClick={() => onLevelChange(lv.id)}
                className={`flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border ${
                  isActive && !lv.color
                    ? 'bg-ink text-white border-ink dark:bg-white dark:text-ink dark:border-white shadow-sm'
                    : !isActive
                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-transparent hover:bg-gray-200 dark:hover:bg-gray-700'
                    : ''
                }`}
                style={
                  isActive && lv.color
                    ? { background: lv.color, color: '#fff', borderColor: lv.color, boxShadow: `0 2px 8px ${lv.color}40` }
                    : undefined
                }
                aria-pressed={isActive}
              >
                {lv.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Type filter */}
      <div>
        <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
          タイプで絞り込む
        </p>
        <div className="flex flex-wrap gap-2">
          {TYPE_OPTIONS.map((ty) => {
            const isActive = selectedType === ty.id
            return (
              <button
                key={ty.id}
                onClick={() => onTypeChange(ty.id)}
                className={`flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border ${
                  isActive
                    ? 'bg-ink text-white border-ink dark:bg-white dark:text-ink dark:border-white shadow-sm'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-transparent hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
                aria-pressed={isActive}
              >
                {ty.label}
              </button>
            )
          })}
        </div>
      </div>
    </>
  )

  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-16 z-30 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4 space-y-3">
        {/* Search row + mobile filter toggle */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="コースを検索…"
              aria-label="コースを検索"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/40 focus:border-indigo-400 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                aria-label="検索クリア"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Mobile: filter toggle button */}
          <button
            className="sm:hidden relative flex items-center gap-1.5 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all duration-200 flex-shrink-0"
            style={
              filtersOpen || activeFilterCount > 0
                ? { background: '#111827', color: '#fff', borderColor: '#111827' }
                : { background: '#F3F4F6', color: '#6B7280', borderColor: 'transparent' }
            }
            onClick={() => setFiltersOpen(!filtersOpen)}
            aria-expanded={filtersOpen}
            aria-label="フィルターを開く"
          >
            <SlidersHorizontal size={15} />
            <span>絞り込み</span>
            {activeFilterCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
            <ChevronDown
              size={14}
              className={`transition-transform duration-200 ${filtersOpen ? 'rotate-180' : ''}`}
            />
          </button>
        </div>

        {/* Mobile: collapsible filter panel */}
        <div className={`sm:hidden overflow-hidden transition-all duration-300 ${filtersOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="space-y-3 pb-1">
            <FilterPanels />
          </div>
        </div>

        {/* Desktop: always visible filter panels */}
        <div className="hidden sm:block space-y-3">
          <FilterPanels />
        </div>

        {/* Result count + reset */}
        <div className="flex items-center justify-between pt-0.5">
          <p className="text-sm text-gray-400 dark:text-gray-500">
            <span className="font-bold text-ink dark:text-white">{resultCount}</span>件のコース
          </p>
          {hasActiveFilter && (
            <button
              onClick={onReset}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X size={12} />
              フィルタをリセット
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
