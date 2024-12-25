import { useState, useEffect } from "react";
import { apiFetch } from './api'; // Импортируем функцию для запросов

function Courses() {
  const [courses, setCourses] = useState([]); // Храним курсы
  const [tests, setTests] = useState([]); // Храним все тесты
  const [filteredTests, setFilteredTests] = useState([]); // Храним отфильтрованные тесты
  const [selectedCourse, setSelectedCourse] = useState(null); // Храним выбранный курс
  const [expandedTest, setExpandedTest] = useState(null); // Храним ID развернутого теста
  const [answers, setAnswers] = useState({}); // Храним ответы на вопросы
  const [error, setError] = useState(null); // Храним ошибку
  const [result, setResult] = useState(null); // Храним результат теста
  const [isResultModalOpen, setIsResultModalOpen] = useState(false); // Стейт для открытия/закрытия модалки с результатом

  // Загружаем данные о курсах
  useEffect(() => {
    apiFetch("http://localhost:8082/courses")
      .then((data) => setCourses(data))
      .catch((err) => setError(err.message));
  }, []); // Выполняется один раз при монтировании компонента

  // Загружаем все тесты
  useEffect(() => {
    apiFetch("http://localhost:8082/api/tests")
      .then((data) => setTests(data)) // Сохраняем все тесты
      .catch((err) => setError(err.message));
  }, []); // Выполняется один раз при монтировании компонента

  // Фильтрация тестов по выбранному курсу
  useEffect(() => {
    if (selectedCourse !== null) {
      // Фильтруем тесты по courseId
      const filtered = tests.filter((test) => test.courseId === selectedCourse);
      setFilteredTests(filtered); // Сохраняем отфильтрованные тесты
    }
  }, [selectedCourse, tests]); // Перезапускаем, когда курс выбран или тесты обновляются

  // Обработчик клика по курсу
  const handleCourseClick = (courseId) => {
    setSelectedCourse(courseId); // Устанавливаем выбранный курс
  };

  // Обработчик открытия/закрытия теста
  const handleToggleTest = (testId) => {
    setExpandedTest(expandedTest === testId ? null : testId); // Если тест открыт, закрываем его, если закрыт - открываем
  };

  // Обработчик выбора ответа
  const handleAnswerChange = (testId, questionId, option) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [testId]: {
        ...prevAnswers[testId],
        [questionId]: option,
      },
    }));
  };

  // Отправка результатов
  const handleFinishTest = (test) => {
    const correctAnswersCount = test.questions.reduce((count, question) => {
      const selectedAnswer = answers[test.id]?.[question.id];
      
      // Проверка, является ли выбранный ответ правильным
      const correctAnswer = question.correctOptions[question.options.indexOf(selectedAnswer)];
      if (correctAnswer) {
        return count + 1;
      }
      return count;
    }, 0);

    const totalQuestions = test.questions.length;
    const score = (correctAnswersCount / totalQuestions) * 100; // Расчет процента правильных ответов
    const passed = score >= 50; // Если процент >= 50, считаем, что тест пройден

    const result = {
      studentId: 1, // Студент с id 1
      test: { // Полный объект теста
        id: test.id,
        title: test.title,
        courseId: test.courseId,
      },
      score,
      passed,
    };
    
    apiFetch("http://localhost:8082/api/results", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(result),
    })
      .then(() => {
        alert("Результаты успешно отправлены!");
        setExpandedTest(null); // Закрыть тест после отправки
        setResult(result); // Сохраняем результат теста
        setIsResultModalOpen(true); // Открываем модальное окно с результатом
      })
      .catch((err) => {
        setError(err.message);
        alert("Произошла ошибка при отправке результатов");
      });    
  };

  // Закрыть модальное окно с результатом
  const closeResultModal = () => {
    setIsResultModalOpen(false);
    setResult(null); // Очищаем результат
  };

  // Если ошибка, отображаем сообщение
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Если данные ещё не загрузились
  if (!courses.length) {
    return <div>Loading courses...</div>;
  }

  // Если выбран курс, показываем тесты
  if (selectedCourse) {
    return (
      <div>
        <h1>Тесты курса</h1>
        <ul>
          {filteredTests.map((test) => (
            <li key={test.id}>
              <div
                style={{
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "5px",
                  marginBottom: "10px",
                  backgroundColor: "#222222",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                }}
              >
                <h2>Тест</h2>

                {/* Если тест развернут, показываем вопросы и варианты */}
                {expandedTest === test.id ? (
                  <div>
                    <p>{test.description}</p>
                    <ul>
                      {test.questions.map((question) => (
                        <li key={question.id}>
                          <p>{question.content}</p>
                          <ul>
                            {question.options.map((option, index) => (
                              <li key={index}>
                                <input
                                  type="radio"
                                  name={`question-${question.id}`}
                                  value={option}
                                  checked={answers[test.id]?.[question.id] === option}
                                  onChange={() => handleAnswerChange(test.id, question.id, option)} // Обработчик выбора ответа
                                />
                                <label>{option}</label>
                              </li>
                            ))}
                          </ul>
                        </li>
                      ))}
                    </ul>
                    <button
                      style={{
                        marginTop: "20px",
                        padding: "10px 20px",
                        backgroundColor: "#4CAF50",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleFinishTest(test)} // Завершение теста
                    >
                      Завершить
                    </button>
                    <button
                      style={{
                        marginTop: "10px",
                        padding: "10px 20px",
                        backgroundColor: "#f44336",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleToggleTest(test.id)} // Закрытие теста
                    >
                      Закрыть
                    </button>
                  </div>
                ) : (
                  <button
                    style={{
                      padding: "10px 20px",
                      backgroundColor: "#007BFF",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                    onClick={() => handleToggleTest(test.id)} // Открытие теста
                  >
                    Открыть
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
        <button onClick={() => setSelectedCourse(null)}>Назад к курсам</button>

        {/* Модальное окно с результатом */}
        {isResultModalOpen && (
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "#222222",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              zIndex: "1000",
            }}
          >
            <h2>Результаты теста</h2>
            <p><strong>Тест:</strong> {result.test.title}</p>
            <p><strong>Баллы:</strong> {result.score.toFixed(2)}%</p>
            <p><strong>Статус:</strong> {result.passed ? "Пройден" : "Не пройден"}</p>
            <button
              style={{
                marginTop: "10px",
                padding: "10px 20px",
                backgroundColor: "#222222",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
              onClick={closeResultModal} // Закрытие модального окна
            >
              Закрыть
            </button>
          </div>
        )}
      </div>
    );
  }

  // Отображаем список курсов
  return (
    <div>
      <h1>Курсы</h1>
      <div className="courses-list">
        {courses.map((course) => (
          <div
            key={course.id}
            className="course-card"
            onClick={() => handleCourseClick(course.id)} // При клике на курс, загружаем тесты
            style={{
              cursor: "pointer",
              border: "1px solid #ddd",
              padding: "20px",
              margin: "10px",
              borderRadius: "8px",
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
              transition: "transform 0.3s",
            }}
            onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")} // Анимация при наведении
            onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
          >
            <h2>{course.title}</h2>
            <p>{course.description}</p>
            <p>Преподаватель: {course.instructor}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Courses;
