import { useState, useEffect, useCallback } from 'react'

const FAVORITES_KEY = 'it-portal:favorites'
const COMPLETED_KEY = 'it-portal:completed'

function loadSet(key) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return new Set()
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return new Set()
    return new Set(parsed)
  } catch {
    return new Set()
  }
}

function saveSet(key, set) {
  try {
    localStorage.setItem(key, JSON.stringify([...set]))
  } catch {
    // ignore quota errors
  }
}

export function useCourseProgress() {
  const [favorites, setFavorites] = useState(() => loadSet(FAVORITES_KEY))
  const [completed, setCompleted] = useState(() => loadSet(COMPLETED_KEY))

  // Persist favorites
  useEffect(() => {
    saveSet(FAVORITES_KEY, favorites)
  }, [favorites])

  // Persist completed
  useEffect(() => {
    saveSet(COMPLETED_KEY, completed)
  }, [completed])

  // Multi-tab sync
  useEffect(() => {
    const handler = (e) => {
      if (e.key === FAVORITES_KEY) setFavorites(loadSet(FAVORITES_KEY))
      if (e.key === COMPLETED_KEY) setCompleted(loadSet(COMPLETED_KEY))
    }
    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
  }, [])

  const isFavorite = useCallback((id) => favorites.has(id), [favorites])
  const isCompleted = useCallback((id) => completed.has(id), [completed])

  const toggleFavorite = useCallback((id) => {
    setFavorites((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const toggleCompleted = useCallback((id) => {
    setCompleted((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const resetAll = useCallback(() => {
    if (!window.confirm('お気に入りと学習進捗をすべてリセットします。よろしいですか？')) return
    setFavorites(new Set())
    setCompleted(new Set())
  }, [])

  return {
    favorites,
    completed,
    isFavorite,
    isCompleted,
    toggleFavorite,
    toggleCompleted,
    resetAll,
  }
}
