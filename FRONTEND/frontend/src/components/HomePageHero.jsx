 import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function HomePageHero() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRoadmapGeneration = async (event) => {
    event.preventDefault();
    const topic = event.target.elements.prompt.value;
    if (!topic) return;

    setIsLoading(true);
    try {
      // Calls the new roadmap endpoint
      const response = await axios.post('http://localhost:5000/api/generate-roadmap', { topic });
      
      // Navigates to the course page, passing the entire new course object (with roadmap)
      navigate(`/course/${response.data._id}`, { state: { course: response.data } });

    } catch (error) {
      console.error("Error generating roadmap:", error);
      alert("Failed to generate the course roadmap. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="text-center">
      <h1 className="text-4xl font-display font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
        Adaptive Learning <span className="text-blue-500">Explorer</span>
      </h1>
      <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-400 sm:text-xl">
        Enter any topic to generate a dynamic learning roadmap and dive deep into each concept on-demand.
      </p>
      <form onSubmit={handleRoadmapGeneration} className="mt-10 max-w-xl mx-auto">
        <div className="relative">
          <input
            type="text"
            name="prompt"
            className="w-full bg-gray-900 border border-gray-700 rounded-md shadow-lg px-5 py-4 text-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all disabled:opacity-50"
            placeholder='e.g., "Quantum Computing"'
            required
            disabled={isLoading}
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white font-bold px-6 py-2 rounded-md shadow-lg hover:bg-blue-700 transition-all transform hover:scale-105 disabled:bg-blue-800 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? 'Building Roadmap...' : 'Explore'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default HomePageHero;