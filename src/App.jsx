import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Courses from './pages/Courses';
import PrivateRoute from './components/PrivateRoute.jsx'; // Импортируем компонент PrivateRoute
import About from './pages/About'; // Импортируем компонент About

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation(); // Получаем текущий путь

  // Проверяем, нужно ли отображать Header
  const hideHeader = location.pathname === '/register' || location.pathname === '/login';

  return (
    <>
      {!hideHeader && <Header />} {/* Отображаем Header, если не на /register или /login */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        {/* Защищенные маршруты */}
        <Route
          path="/courses"
          element={
            <PrivateRoute>
              <Courses />
            </PrivateRoute>
          }
        />
        <Route
          path="/about"
          element={
            <PrivateRoute>
              <About />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
