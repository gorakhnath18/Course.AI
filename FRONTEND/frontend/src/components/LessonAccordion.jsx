 import { useState } from 'react';
import axios from 'axios';
import EmbeddedVideo from './EmbeddedVideo';
import Flashcard from './Flashcard';
import Quiz from './Quiz';

function LessonAccordion({ lesson, lessonNumber }) {
  const [isOpen, setIsOpen] = useState(false);
  
  // --- New State for On-Demand Quiz ---
  const [quizData, setQuizData] = useState(null); // Will hold the generated quiz questions
  const [questionCount, setQuestionCount] = useState(3); // Default number of questions
  const [isQuizLoading, setIsQuizLoading] = useState(false);

  // --- New Function to Handle Quiz Generation ---
  const handleGenerateQuiz = async () => {
    setIsQuizLoading(true);
    setQuizData(null); // Clear old quiz data
    try {
      const response = await axios.post('http://localhost:5000/api/generate-quiz', {
        lessonTopic: lesson.title,
        questionCount: questionCount
      });
      setQuizData(response.data);
    } catch (error) {
      console.error("Failed to generate quiz:", error);
      alert("Sorry, we couldn't generate a quiz right now. Please try again.");
    } finally {
      setIsQuizLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 text-left flex justify-between items-center hover:bg-gray-800 focus:outline-none"
      >
        <div className="flex items-center">
          <span className="text-blue-500 font-bold mr-4 text-lg">{lessonNumber}</span>
          <h3 className="font-display font-bold text-xl text-white">
            {lesson.title}
          </h3>
        </div>
        <svg
          className={`w-6 h-6 text-gray-400 transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>

      <div className={`transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[5000px]' : 'max-h-0'}`}>
        <div className="p-6 border-t border-gray-700 space-y-8">
          
          {/* Learning Objectives, Notes, and Videos sections are unchanged */}
          <div>
            <h4 className="font-bold text-lg text-white mb-3">Learning Objectives</h4>
            <ul className="list-disc list-inside space-y-1 text-gray-300">
              {lesson.learningObjectives.map((obj, index) => <li key={index}>{obj}</li>)}
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg text-white mb-3">Lesson Notes</h4>
            <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
              {lesson.notes}
            </p>
          </div>
          <div>
            <h4 className="font-bold text-lg text-white mb-3">Recommended Videos</h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {lesson.youtubeVideos.map(video => <EmbeddedVideo key={video.videoId} {...video} />)}
            </div>
          </div>
          
          {/* --- NEW On-Demand Quiz Section --- */}
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h4 className="font-bold text-lg text-white mb-4">Generate a Practice Quiz</h4>
            <div className="flex items-center gap-4">
              <input
                type="number"
                value={questionCount}
                onChange={(e) => setQuestionCount(Math.max(1, parseInt(e.target.value) || 1))}
                className="bg-gray-900 border border-gray-600 rounded-md w-20 text-center py-2"
                min="1"
                max="10"
              />
              <button
                onClick={handleGenerateQuiz}
                disabled={isQuizLoading}
                className="bg-blue-600 text-white font-bold px-5 py-2 rounded-md shadow-lg hover:bg-blue-700 transition-all disabled:bg-gray-500 disabled:cursor-not-allowed"
              >
                {isQuizLoading ? 'Generating...' : `Generate ${questionCount} Questions`}
              </button>
            </div>
          </div>
          
          {/* --- Conditionally Render the Quiz --- */}
          {quizData && (
            <div>
              <h4 className="font-bold text-lg text-white mb-3">Your Practice Quiz</h4>
              <Quiz questions={quizData} />
            </div>
          )}

          <div>
            <h4 className="font-bold text-lg text-white mb-3">Flashcards for Revision</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {lesson.flashcards.map((card, index) => <Flashcard key={index} card={card} />)}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default LessonAccordion;