import { useParams } from 'react-router-dom';
import { mockCourse } from '../lib/mockData';
import LessonAccordion from '../components/LessonAccordion';

function CoursePage() {
  const { courseId } = useParams();

  // In a real app, you would use courseId to fetch data.
  // For now, we'll just use our mock course.
  const course = mockCourse;

  return (
    <div>
      <h1 className="text-4xl font-display font-bold text-white mb-2">
        {course.title}
      </h1>
      <p className="text-lg text-gray-400 mb-8">
        Original prompt: "{course.originalPrompt}"
      </p>

      <div className="space-y-4">
        {course.lessons.map((lesson, index) => (
          <LessonAccordion 
            key={lesson.id} 
            lesson={lesson} 
            lessonNumber={index + 1}
          />
        ))}
      </div>
    </div>
  );
}

export default CoursePage;