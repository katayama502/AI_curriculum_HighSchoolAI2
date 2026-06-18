import React from 'react'
import { ChevronRight } from 'lucide-react'
import { CATEGORIES } from '../data/courses.js'

const SPOTLIGHT_KEYS = ['basics', 'programming', 'ai_ml', 'network', 'database', 'security']

export default function CategorySpotlight({ onSelectCategory }) {
  const handleClick = (categoryKey) => {
    onSelectCategory(categoryKey)
    document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="py-20 px-4 sm:px-6 bg-white dark:bg-gray-900/50">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-14">
          <span className="inline-block text-sm font-semibold tracking-wider uppercase text-gray-400 dark:text-gray-500 mb-3">
            カテゴリ
          </span>
          <h2 className="font-jakarta font-extrabold text-3xl sm:text-4xl text-ink dark:text-white mb-4">
            どこから学びはじめる？
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-base max-w-xl mx-auto leading-relaxed">
            カードをクリックするとそのカテゴリのコースだけ表示されます。
          </p>
        </div>

        {/* Category cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SPOTLIGHT_KEYS.map((key) => {
            const cat = CATEGORIES[key]
            return (
              <article
                key={key}
                onClick={() => handleClick(key)}
                className="group relative bg-paper dark:bg-gray-800 rounded-3xl shadow-card hover:shadow-card-hover hover:-translate-y-1.5 transition-all duration-300 cursor-pointer overflow-hidden border border-gray-100 dark:border-gray-700"
              >
                {/* Top gradient accent */}
                <div
                  className="h-2 w-full"
                  style={{ background: cat.gradient }}
                  aria-hidden="true"
                />

                <div className="p-6 sm:p-7">
                  {/* Emoji + name */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span
                        className="flex items-center justify-center w-14 h-14 rounded-2xl text-3xl shadow-sm"
                        style={{ background: cat.accentSoft }}
                        role="img"
                        aria-label={cat.label}
                      >
                        {cat.emoji}
                      </span>
                      <div>
                        <h3
                          className="font-jakarta font-bold text-xl leading-tight"
                          style={{ color: cat.color }}
                        >
                          {cat.label}
                        </h3>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{cat.tagline}</p>
                      </div>
                    </div>
                    <ChevronRight
                      size={18}
                      className="text-gray-300 dark:text-gray-600 group-hover:text-gray-500 dark:group-hover:text-gray-400 group-hover:translate-x-1 transition-all mt-1"
                    />
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-5 line-clamp-3">
                    {cat.description}
                  </p>

                  {/* Link hint */}
                  <span
                    className="inline-flex items-center gap-1.5 text-xs font-semibold transition-opacity hover:opacity-70"
                    style={{ color: cat.color }}
                  >
                    このカテゴリを見る
                    <ChevronRight size={12} />
                  </span>
                </div>

                {/* Hover overlay */}
                <div
                  className="absolute inset-x-0 bottom-0 h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                  style={{ background: cat.gradient }}
                  aria-hidden="true"
                />
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
