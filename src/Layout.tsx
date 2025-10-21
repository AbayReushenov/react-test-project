import { NavLink, Outlet } from "react-router-dom"


function Layout() {
  return (
    <>
    <nav>
      <NavLink to="/" className={({ isActive }) => isActive ? 'active' : undefined}>Главная</NavLink>
      <NavLink to="/about" className={({ isActive }) => isActive ? 'active' : undefined}>О проекте</NavLink>
      <NavLink to="/simple-counter" className={({ isActive }) => isActive ? 'active' : undefined}>Простой счетчик</NavLink>
    </nav>

    <main>
      <Outlet />
    </main>
    </>
  )
}

export default Layout

