import { useState } from 'react'
import { useHabitsStore } from '../store/habitsStore'

export default function HabitForm() {
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const addHabit = useHabitsStore((state) => state.addHabit)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name) addHabit(name, category || 'Общее')
    setName('')
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        className="border px-2 py-1"
        placeholder="Введите привычку..."
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        className="border px-2 py-1"
        placeholder="Категория"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />
      <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded">
        Добавить
      </button>
    </form>
  )
}
