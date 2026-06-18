import React from 'react'
import { Heart } from 'lucide-react'
import { CATEGORIES } from '../data/courses.js'

const FOOTER_CATEGORIES = ['basics', 'programming', 'ai_ml', 'network', 'database', 'security', 'cloud', 'business', 'ai_security', 'paper']

export default function Footer() {
  return (
    <footer className="bg-ink dark:bg-gray-950 text-gray-300 dark:text-gray-400 py-14 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Top: logo + links */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 mb-10">
          {/* Brand */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl" role="img" aria-label="ロゴ">🖥️</span>
              <span className="font-jakarta font-bold text-xl text-white">
                IT学習ポータル
              </span>
            </div>
            <p className="text-sm text-gray-400 dark:text-gray-500 leading-relaxed max-w-xs">
              情報系学科の学習ポータルです。各コースの内容・動画・リンクは参考資料として提供しています。
            </p>
          </div>

          {/* このサイトについて */}
          <div className="flex-shrink-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
              このサイトについて
            </p>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              情報系学科の学習ポータルです。各コースの内容・動画・リンクは参考資料として提供しています。著作権は各コンテンツ制作者に帰属します。
            </p>
          </div>

          {/* Category links */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
              カテゴリ
            </p>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-2">
              {FOOTER_CATEGORIES.map((key) => {
                const cat = CATEGORIES[key]
                return (
                  <li key={key}>
                    <a
                      href="#gallery"
                      onClick={(e) => {
                        e.preventDefault()
                        document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' })
                      }}
                      className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors group"
                    >
                      <span aria-hidden="true">{cat.emoji}</span>
                      <span
                        className="font-medium group-hover:underline"
                        style={{ color: cat.color }}
                      >
                        {cat.label}
                      </span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-gray-600 dark:text-gray-700">
            <p>
              © {new Date().getFullYear()} IT学習ポータル. All rights reserved.
            </p>
            <p className="flex items-center gap-1">
              Made with <Heart size={11} className="text-red-400" fill="currentColor" /> for students
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
