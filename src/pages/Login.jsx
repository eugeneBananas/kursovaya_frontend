import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const navigate = useNavigate(); // Хук для навигации

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8081/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        alert('Вы вошли успешно!');
        navigate('/');
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || 'Login failed'}`);
        console.error('Error response:', errorData);
      }
    } catch (error) {
      alert('An error occurred during login.');
      console.error('Network error:', error);
    }
  };

  return (
    <div>
      <h1>Вход</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Пароль:
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <button type="submit">Войти</button>
      </form>
      <p>
        У вас нет аккаунта? <Link to="/register">Регистрация</Link>
      </p>
    </div>
  );
}

export default Login;
