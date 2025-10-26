import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'

interface Habit {
  id: number
  name: string
  category: string
  completed: string[]
}

interface StoreState {
  habits: Habit[]
  addHabit: (name: string, category: string) => void
  toggleHabit: (id: number, date: string) => void
  removeHabit: (id: number) => void
}

export const useHabitsStore = create<StoreState>()(
  devtools(
    persist(
      (set) => ({
        habits: [],
        addHabit: (name, category) =>
          set((state) => ({
            habits: [...state.habits, { id: Date.now(), name, category, completed: [] }]
          })),
        toggleHabit: (id, date) =>
          set((state) => ({
            habits: state.habits.map((habit) =>
              habit.id === id
                ? {
                    ...habit,
                    completed: habit.completed.includes(date)
                      ? habit.completed.filter((d) => d !== date)
                      : [...habit.completed, date],
                  }
                : habit
            ),
          })),
        removeHabit: (id) =>
          set((state) => ({ habits: state.habits.filter((h) => h.id !== id) })),
      }),
      { name: 'habits-storage' }
    )
  )
)
