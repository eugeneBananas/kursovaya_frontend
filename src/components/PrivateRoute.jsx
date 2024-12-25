import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types'; // Импортируем prop-types

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");

  return token ? children : <Navigate to="/login" replace />;
}

// Добавляем валидацию пропсов
PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired, // Проверяем, что children передается и является React-узлом
};

export default PrivateRoute;
