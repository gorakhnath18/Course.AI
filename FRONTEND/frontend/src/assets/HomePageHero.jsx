import { useNavigate } from 'react-router-dom';

function HomePageHero() {
  const navigate = useNavigate();

  const handleCourseGeneration = (event) => {
    event.preventDefault();
    // For now, we navigate to our mock course page.
    // In the future, this will trigger the AI generation.
    navigate('/course/course_123');
  };

  return (
    <div className="text-center">
      <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
        AI-Powered Course Builder
      </h1>
      <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600 sm:text-xl">
        Turn any topic into a structured, multimedia-rich learning course in seconds. Just enter a prompt to get started.
      </p>
      <form onSubmit={handleCourseGeneration} className="mt-8 max-w-xl mx-auto flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          name="prompt"
          className="flex-grow w-full px-4 py-3 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-lg"
          placeholder='e.g., "Teach me pointers in C++"'
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Generate Course
        </button>
      </form>
    </div>
  );
}

export default HomePageHero;