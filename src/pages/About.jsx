import { useEffect, useState } from 'react';

function About() {
  const [studentInfo, setStudentInfo] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentInfo = async () => {
      try {
        const token = localStorage.getItem('token'); // Получаем токен из localStorage
        if (!token) {
          setError('Unauthorized: No token found');
          setLoading(false);
          return;
        }
        
        // Декодируем токен
        const payload = JSON.parse(atob(token.split('.')[1]));
        
        // Логирование для проверки структуры токена
        console.log(payload);
        
        // Вместо payload.email используем payload.sub
        const email = payload.sub;
        
        if (!email) {
          setError('Invalid token: Email not found');
          setLoading(false);
          return;
        }
        
        // Запрос на получение информации о пользователе
        const response = await fetch(`http://localhost:8081/api/users/email/${email}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Передаем токен в заголовке
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          setStudentInfo(data); // Сохраняем данные о студенте
        } else {
          const errorData = await response.json();
          setError(errorData.message || 'Failed to fetch student information');
        }
      } catch (err) {
        setError('An error occurred while fetching student information.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentInfo();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Student Information</h1>
      <p><strong>Имя:</strong> {studentInfo.fullName}</p>
      <p><strong>Email:</strong> {studentInfo.email}</p>
      <p><strong>Роль:</strong> {studentInfo.role}</p>
    </div>
  );
}

export default About;
