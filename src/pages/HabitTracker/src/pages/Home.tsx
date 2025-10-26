import HabitForm from '../components/HabitForm'
import HabitList from '../components/HabitList'

export default function Home() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Трекер привычек</h1>
      <HabitForm />
      <HabitList />
    </div>
  )
}
