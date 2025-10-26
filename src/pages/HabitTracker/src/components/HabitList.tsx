import { useHabitsStore } from '../store/habitsStore'

export default function HabitList() {
  const { habits, toggleHabit, removeHabit } = useHabitsStore()

  return (
    <div className="mt-4 space-y-3">
      {habits.map((habit) => (
        <div key={habit.id} className="flex justify-between items-center border p-2 rounded">
          <div>
            <span className="font-semibold">{habit.name}</span> ({habit.category})
          </div>
          <div>
            <button
              onClick={() => toggleHabit(habit.id, new Date().toISOString().split('T')[0])}
              className="mr-2 bg-green-500 text-white px-2 py-1 rounded"
            >
              Отметить
            </button>
            <button
              onClick={() => removeHabit(habit.id)}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              Удалить
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
