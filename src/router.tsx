import { createBrowserRouter } from 'react-router-dom'
import Home from './pages/home/Home'
import HabitTrackers from './pages/HabitTracker/src/HabitTrackers'
import About from './pages/about/About'
import Layout from './Layout'
import SimpleCounter from './pages/simpleCounter/SimpleCounter'
import WeatherDashboard from './pages/weatherDashboard/WeatherDashboard'

const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            { index: true, element: <Home /> },
            { path: 'about', element: <About /> },
            { path: 'simple-counter', element: <SimpleCounter /> },
            { path: 'habit-tracker', element: <HabitTrackers /> },
            { path: 'weather-dashboard', element: <WeatherDashboard /> },
        ],
    },
])

export default router
