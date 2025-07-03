 import { useState } from 'react';
import EmbeddedVideo from './EmbeddedVideo';
import Flashcard from './Flashcard';
import Quiz from './Quiz'; // <-- 1. IMPORT THE NEW COMPONENT

function LessonAccordion({ lesson, lessonNumber }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden">
      {/* ... (The <button> part remains unchanged) ... */}
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
          
          {/* ... (Learning Objectives, Notes, and Videos sections remain unchanged) ... */}
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
          
          {/* 2. ADD THE QUIZ COMPONENT HERE */}
          <div>
            <h4 className="font-bold text-lg text-white mb-3">Check Your Knowledge</h4>
            <Quiz questions={lesson.quiz} />
          </div>
          
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