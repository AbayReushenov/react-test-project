import { createBrowserRouter } from 'react-router-dom'
import Home from './pages/home/Home'
import HabitTrackers from './pages/HabitTracker/src/HabitTrackers'
import About from './pages/about/About'
import Layout from './Layout'
import SimpleCounter from './pages/simpleCounter/SimpleCounter'
import WeatherDashboard from './pages/weatherDashboard/WeatherDashboard'
import EcommerceShop from './pages/EcommerceShop/EcommerceShop'
import UseMemoCase from './pages/UseMemoCase/UseMemoCase';
import MemoExample from './pages/MemoExample/MemoExample';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            { index: true, element: <Home /> },
            { path: 'about', element: <About /> },
            { path: 'use-memo-case', element: <UseMemoCase /> },
            { path: 'memo-example', element: <MemoExample /> },
            { path: 'simple-counter', element: <SimpleCounter /> },
            { path: 'habit-tracker', element: <HabitTrackers /> },
            { path: 'ecommerce-shop', element: <EcommerceShop /> },
            { path: 'weather-dashboard', element: <WeatherDashboard /> },

        ],
    },
])

export default router
