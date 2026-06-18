import React, { useState, useMemo, useCallback } from 'react'
import { COURSES } from './data/courses.js'
import { useDarkMode } from './hooks/useDarkMode.js'
import { useCourseProgress } from './hooks/useCourseProgress.js'
import { CourseProgressContext } from './context/CourseProgressContext.jsx'
import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import CategorySpotlight from './components/CategorySpotlight.jsx'
import ProgressDashboard from './components/ProgressDashboard.jsx'
import FilterBar from './components/FilterBar.jsx'
import CourseCard from './components/CourseCard.jsx'
import CourseModal from './components/CourseModal.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  const { isDark, toggle } = useDarkMode()
  const progress = useCourseProgress()

  // Filter state
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedLevel, setSelectedLevel] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [showUnlearnedOnly, setShowUnlearnedOnly] = useState(false)

  // Modal state
  const [activeCourse, setActiveCourse] = useState(null)

  // Filter logic (AND)
  const filteredCourses = useMemo(() => {
    return COURSES.filter((course) => {
      const matchCategory = selectedCategory === 'all' || course.category === selectedCategory
      const matchLevel = selectedLevel === 'all' || course.level === selectedLevel
      const matchType = selectedType === 'all' || course.type === selectedType
      const q = searchQuery.trim().toLowerCase()
      const matchSearch =
        !q ||
        course.title.toLowerCase().includes(q) ||
        course.description.toLowerCase().includes(q) ||
        (course.tags && course.tags.some((t) => t.toLowerCase().includes(q)))
      const matchFav = !showFavoritesOnly || progress.favorites.has(course.id)
      const matchUnlearned = !showUnlearnedOnly || !progress.completed.has(course.id)
      return matchCategory && matchLevel && matchType && matchSearch && matchFav && matchUnlearned
    })
  }, [selectedCategory, selectedLevel, selectedType, searchQuery, showFavoritesOnly, showUnlearnedOnly, progress.favorites, progress.completed])

  const scrollToGallery = useCallback(() => {
    document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const handleSelectCategory = useCallback((cat) => {
    setSelectedCategory(cat)
    setSelectedLevel('all')
    setSelectedType('all')
    setSearchQuery('')
    scrollToGallery()
  }, [scrollToGallery])

  const handleReset = useCallback(() => {
    setSelectedCategory('all')
    setSelectedLevel('all')
    setSelectedType('all')
    setSearchQuery('')
    setShowFavoritesOnly(false)
    setShowUnlearnedOnly(false)
  }, [])

  const handleActivateFavoritesFilter = useCallback(() => {
    setShowFavoritesOnly(true)
    setShowUnlearnedOnly(false)
    scrollToGallery()
  }, [scrollToGallery])

  return (
    <CourseProgressContext.Provider value={progress}>
      <div className="min-h-screen bg-paper dark:bg-gray-950 transition-colors duration-300">
        <Header
          isDark={isDark}
          onToggleDark={toggle}
          completedCount={progress.completed.size}
          totalCount={COURSES.length}
        />

        <main>
          <Hero />

          <CategorySpotlight onSelectCategory={handleSelectCategory} />

          <ProgressDashboard onFavoritesFilter={handleActivateFavoritesFilter} />

          {/* Card gallery section */}
          <section id="gallery" className="min-h-screen">
            {/* Section header */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-4">
              <div className="text-center mb-10">
                <span className="inline-block text-sm font-semibold tracking-wider uppercase text-gray-400 dark:text-gray-500 mb-3">
                  学習コース
                </span>
                <h2 className="font-jakarta font-extrabold text-3xl sm:text-4xl text-ink dark:text-white mb-3">
                  気になるコースから始めよう
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-base max-w-xl mx-auto leading-relaxed">
                  カードをクリックすると詳しい解説や動画を確認できます。
                </p>
              </div>
            </div>

            <FilterBar
              selectedCategory={selectedCategory}
              selectedLevel={selectedLevel}
              selectedType={selectedType}
              searchQuery={searchQuery}
              onCategoryChange={setSelectedCategory}
              onLevelChange={setSelectedLevel}
              onTypeChange={setSelectedType}
              onSearchChange={setSearchQuery}
              resultCount={filteredCourses.length}
              showFavoritesOnly={showFavoritesOnly}
              onToggleFavorites={() => setShowFavoritesOnly((v) => !v)}
              showUnlearnedOnly={showUnlearnedOnly}
              onToggleUnlearned={() => setShowUnlearnedOnly((v) => !v)}
              onReset={handleReset}
            />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
              {filteredCourses.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredCourses.map((course) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      onClick={() => setActiveCourse(course)}
                    />
                  ))}
                </div>
              ) : (
                /* Empty state */
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <div className="text-6xl mb-6" role="img" aria-label="見つかりません">
                    🔍
                  </div>
                  <h3 className="font-bold text-xl text-ink dark:text-white mb-2">
                    条件に合うコースがありません
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 max-w-xs leading-relaxed">
                    検索ワードやフィルタを変えてみると見つかるかもしれません。
                  </p>
                  <button
                    onClick={handleReset}
                    className="px-6 py-2.5 bg-ink dark:bg-white text-white dark:text-ink font-semibold rounded-xl text-sm hover:opacity-80 transition-opacity"
                  >
                    フィルタをリセット
                  </button>
                </div>
              )}
            </div>
          </section>
        </main>

        <Footer />

        {/* Modal */}
        {activeCourse && (
          <CourseModal course={activeCourse} onClose={() => setActiveCourse(null)} />
        )}
      </div>
    </CourseProgressContext.Provider>
  )
}
