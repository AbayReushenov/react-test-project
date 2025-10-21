import { createBrowserRouter } from 'react-router-dom';
import Home from "./pages/home/Home"
import About from "./pages/about/About"
import Layout from './Layout';
import SimpleCounter from './pages/simpleCounter/SimpleCounter';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home />},
      { path: "about", element: < About />},
      { path: "simple-counter", element: < SimpleCounter />}
    ]
  }
])

export default router
