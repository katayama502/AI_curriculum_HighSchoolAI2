import React from 'react'
import { ArrowDown } from 'lucide-react'
import { CATEGORIES } from '../data/courses.js'

const HERO_CATEGORIES = ['basics', 'programming', 'ai_ml', 'security', 'cloud']

export default function Hero() {
  const handleScrollToGallery = () => {
    document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="top"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
    >
      {/* Animated background blobs */}
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        {/* Gradient base */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-indigo-50/40 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950/30" />

        {/* Blob 1 – basics indigo */}
        <div
          className="absolute top-1/4 -left-20 w-80 h-80 rounded-full opacity-20 dark:opacity-10 blur-3xl animate-blob"
          style={{ background: 'radial-gradient(circle, #6366f1, transparent 70%)' }}
        />
        {/* Blob 2 – programming blue */}
        <div
          className="absolute top-1/3 right-0 w-96 h-96 rounded-full opacity-20 dark:opacity-10 blur-3xl animate-blob animation-delay-2000"
          style={{ background: 'radial-gradient(circle, #0ea5e9, transparent 70%)' }}
        />
        {/* Blob 3 – ai_ml purple */}
        <div
          className="absolute bottom-1/4 left-1/3 w-72 h-72 rounded-full opacity-15 dark:opacity-10 blur-3xl animate-blob animation-delay-4000"
          style={{ background: 'radial-gradient(circle, #8b5cf6, transparent 70%)' }}
        />
        {/* Blob 4 – cloud blue */}
        <div
          className="absolute top-10 right-1/4 w-56 h-56 rounded-full opacity-15 dark:opacity-8 blur-3xl animate-blob animation-delay-2000"
          style={{ background: 'radial-gradient(circle, #3b82f6, transparent 70%)' }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {/* Main title */}
        <h1 className="font-jakarta font-extrabold text-[1.75rem] sm:text-5xl md:text-6xl leading-[1.2] mb-6 text-ink dark:text-white tracking-tight">
          大学で役立つIT技術を
          <br />
          <span
            className="gradient-text text-[1.5rem] sm:text-5xl md:text-6xl"
            style={{
              backgroundImage: 'linear-gradient(135deg, #6366f1 0%, #0ea5e9 50%, #10b981 100%)',
            }}
          >
            カードで、動画で、わかりやすく学ぶ
          </span>
        </h1>

        {/* Lead */}
        <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto mb-10">
          プログラミング・ネットワーク・AI・セキュリティまで。カードをクリックすると詳しい解説と動画が確認できます。
        </p>

        {/* Category chips */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {HERO_CATEGORIES.map((key) => {
            const cat = CATEGORIES[key]
            return (
              <div
                key={key}
                className="flex items-center gap-2 px-4 py-2 rounded-full shadow-sm border backdrop-blur-sm"
                style={{
                  background: cat.accentSoft,
                  borderColor: cat.color + '40',
                }}
              >
                <span className="text-lg" role="img" aria-label={cat.label}>
                  {cat.emoji}
                </span>
                <span
                  className="font-jakarta font-bold text-sm"
                  style={{ color: cat.color }}
                >
                  {cat.label}
                </span>
              </div>
            )
          })}
        </div>

        {/* CTA Button */}
        <button
          onClick={handleScrollToGallery}
          className="group inline-flex items-center gap-3 bg-ink dark:bg-white text-white dark:text-ink font-bold text-base sm:text-lg px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
        >
          学びはじめる
          <ArrowDown
            size={20}
            className="group-hover:translate-y-1 transition-transform duration-300"
          />
        </button>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40" aria-hidden="true">
        <div className="w-px h-12 bg-gradient-to-b from-transparent to-gray-400 dark:to-gray-500" />
      </div>
    </section>
  )
}
