import { useHabitsStore } from '../store/habitsStore'

export default function HabitList() {
  const { habits, toggleHabit, removeHabit } = useHabitsStore()
  const today = new Date().toISOString().split('T')[0]

  return (
      <div className='mt-4 space-y-3'>
          {habits.map((habit) => (
              <div key={habit.id} className='flex justify-between items-center border p-2 rounded'>
                  <div>
                      <span className='font-semibold'>{habit.name}</span> ({habit.category})
                  </div>
                  <div>
                      <button
                          onClick={() => toggleHabit(habit.id, today)}
                          className={`mr-2 px-2 py-1 rounded ${
                              habit.completed.includes(today) ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-800'
                          }`}
                      >
                          {habit.completed.includes(today) ? 'Отмечено' : 'Отметить'}
                      </button>
                      <button onClick={() => removeHabit(habit.id)} className='bg-red-500 text-white px-2 py-1 rounded'>
                          Удалить
                      </button>
                  </div>
              </div>
          ))}
      </div>
  )
}
