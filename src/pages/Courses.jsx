import { useState, useEffect } from "react";
import { apiFetch } from './api';

function Courses() {
  const [courses, setCourses] = useState([]);
  const [tests, setTests] = useState([]);
  const [filteredTests, setFilteredTests] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [expandedTest, setExpandedTest] = useState(null);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);

  useEffect(() => {
    apiFetch("http://localhost:8082/courses")
      .then((data) => setCourses(data))
      .catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
    apiFetch("http://localhost:8082/api/tests")
      .then((data) => setTests(data))
      .catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
    if (selectedCourse !== null) {
      const filtered = tests.filter((test) => test.courseId === selectedCourse);
      setFilteredTests(filtered);
    }
  }, [selectedCourse, tests]);

  const handleCourseClick = (courseId) => {
    setSelectedCourse(courseId);
  };

  const handleToggleTest = (testId) => {
    setExpandedTest(expandedTest === testId ? null : testId);
  };

  const handleAnswerChange = (testId, questionId, option) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [testId]: {
        ...prevAnswers[testId],
        [questionId]: option,
      },
    }));
  };

  const handleFinishTest = (test) => {
    const correctAnswersCount = test.questions.reduce((count, question) => {
      const selectedAnswer = answers[test.id]?.[question.id];
      const correctAnswer = question.correctOptions[question.options.indexOf(selectedAnswer)];
      if (correctAnswer) {
        return count + 1;
      }
      return count;
    }, 0);

    const totalQuestions = test.questions.length;
    const score = (correctAnswersCount / totalQuestions) * 100;
    const passed = score >= 50;

    const result = {
      studentId: 1,
      test: {
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
        setExpandedTest(null);
        setResult(result);
        setIsResultModalOpen(true);
      })
      .catch((err) => {
        setError(err.message);
        alert("Произошла ошибка при отправке результатов");
      });    
  };

  const closeResultModal = () => {
    setIsResultModalOpen(false);
    setResult(null);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!courses.length) {
    return <div>Loading courses...</div>;
  }

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
                                  onChange={() => handleAnswerChange(test.id, question.id, option)}
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
                      onClick={() => handleFinishTest(test)}
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
                      onClick={() => handleToggleTest(test.id)}
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
                    onClick={() => handleToggleTest(test.id)}
                  >
                    Открыть
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
        <button onClick={() => setSelectedCourse(null)}>Назад к курсам</button>
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
              onClick={closeResultModal}
            >
              Закрыть
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <h1>Курсы</h1>
      <div className="courses-list">
        {courses.map((course) => (
          <div
            key={course.id}
            className="course-card"
            onClick={() => handleCourseClick(course.id)}
            style={{
              cursor: "pointer",
              border: "1px solid #ddd",
              padding: "20px",
              margin: "10px",
              borderRadius: "8px",
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
              transition: "transform 0.3s",
            }}
            onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
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
