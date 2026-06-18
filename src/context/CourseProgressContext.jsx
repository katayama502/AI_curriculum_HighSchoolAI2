import React, { createContext, useContext } from 'react'

export const CourseProgressContext = createContext(null)

export function useProgress() {
  const ctx = useContext(CourseProgressContext)
  if (!ctx) throw new Error('useProgress must be used within CourseProgressContext.Provider')
  return ctx
}
