import { useParams } from 'react-router-dom';

function CourseDetail() {
  const { id } = useParams();
  const courses = [
    {
      title: 'Математика',
      description: 'Курс, посвящённый основным математическим понятиям и методам.',
      instructor: 'Иван Иванов',
    },
    {
      title: 'Русский язык',
      description: 'Изучение грамматики, орфографии и культуры речи.',
      instructor: 'Мария Петрова',
    },
    {
      title: 'Биология',
      description: 'Основы биологии: анатомия, экология и биохимия.',
      instructor: 'Сергей Сергеев',
    },
  ];

  const course = courses[id];

  if (!course) {
    return <h2>Курс не найден</h2>;
  }

  return (
    <div>
      <h1>{course.title}</h1>
      <p><strong>Преподаватель:</strong> {course.instructor}</p>
      <p>{course.description}</p>
    </div>
  );
}

export default CourseDetail;
