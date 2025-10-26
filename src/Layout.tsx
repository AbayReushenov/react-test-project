import { NavLink, Outlet } from "react-router-dom"


function Layout() {
  return (
    <>
    <nav>
      <NavLink to="/" className={({ isActive }) => isActive ? 'active' : undefined}>Главная</NavLink>
      <NavLink to="/about" className={({ isActive }) => isActive ? 'active' : undefined}>О проекте</NavLink>
      <NavLink to="/simple-counter" className={({ isActive }) => isActive ? 'active' : undefined}>Простой счетчик</NavLink>
      <NavLink to="/habit-tracker" className={({ isActive }) => isActive ? 'active' : undefined}>Трекер привычек</NavLink>
      <NavLink to="/weather-dashboard" className={({ isActive }) => isActive ? 'active' : undefined}>Погодный дашборд с прогнозом</NavLink>
    </nav>

    <main>
      <Outlet />
    </main>
    </>
  )
}

export default Layout

