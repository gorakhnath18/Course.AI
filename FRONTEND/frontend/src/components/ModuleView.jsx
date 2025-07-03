 import { useState, useEffect } from 'react';
import axios from 'axios';
import EmbeddedVideo from './EmbeddedVideo';
import Flashcard from './Flashcard';
import Quiz from './Quiz';
import { CgSpinner } from 'react-icons/cg';
import { FaYoutube, FaLightbulb, FaExpandArrowsAlt, FaVial, FaSearch, FaUser, FaRobot } from 'react-icons/fa';

// A sub-component for the interactive deep dive chips
const DeepDiveChip = ({ text, onClick, isLoading }) => (
    <button 
      onClick={onClick}
      disabled={isLoading}
      className="bg-gray-700/50 border border-gray-600 rounded-full px-4 py-2 text-sm text-blue-300 flex items-center gap-2 hover:bg-gray-600 transition-all disabled:cursor-not-allowed disabled:opacity-60"
    >
        {isLoading ? <CgSpinner className="animate-spin" /> : <FaLightbulb />}
        <span>{text}</span>
    </button>
);

// A sub-component for the in-module search bar form
const ModuleSearchBar = ({ onSearch, isLoading }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const query = e.target.elements.query.value;
    if (!query.trim()) return;
    onSearch(query);
    e.target.elements.query.value = ''; // Clear input after submission
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-3">
      <input
        type="text"
        name="query"
        placeholder="Ask anything about the notes above..."
        className="flex-grow bg-gray-900 border border-gray-600 rounded-md shadow-sm px-4 py-2 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
        disabled={isLoading}
      />
      <button
        type="submit"
        className="bg-green-600 text-white font-bold px-5 py-2 rounded-md shadow-lg hover:bg-green-700 transition-all disabled:bg-gray-500 disabled:cursor-not-allowed"
        disabled={isLoading}
      >
        {isLoading ? <CgSpinner className="animate-spin" /> : 'Ask'}
      </button>
    </form>
  );
};


function ModuleView({ moduleData }) {
  // State variables for all interactive components
  const [quizData, setQuizData] = useState(null);
  const [questionCount, setQuestionCount] = useState(3);
  const [isQuizLoading, setIsQuizLoading] = useState(false);
  const [videos, setVideos] = useState([]);
  const [areVideosLoading, setAreVideosLoading] = useState(false);
  const [deepDiveContent, setDeepDiveContent] = useState('');
  const [deepDiveTopic, setDeepDiveTopic] = useState('');
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [qaHistory, setQaHistory] = useState([]);

  // Effect to reset all temporary states when a new module is selected
  useEffect(() => {
    setQuizData(null); setIsQuizLoading(false);
    setVideos([]); setAreVideosLoading(false);
    setDeepDiveContent(''); setDeepDiveTopic('');
    setQaHistory([]); setIsSearchLoading(false);
  }, [moduleData]);
  
  // Handler for the new search bar
  const handleModuleSearch = async (userQuestion) => {
    setIsSearchLoading(true);
    setQaHistory(prev => [...prev, { question: userQuestion, answer: null }]);
    try {
      const contextNotes = moduleData.notes.join('\n\n');
      const response = await axios.post('http://localhost:5000/api/search-module', { contextNotes, userQuestion });
      setQaHistory(prev => prev.map(qa => qa.question === userQuestion ? { ...qa, answer: response.data.answer } : qa));
    } catch (error) {
      alert('Sorry, there was an error answering your question.');
      setQaHistory(prev => prev.filter(qa => qa.question !== userQuestion));
    } finally {
      setIsSearchLoading(false);
    }
  };

  // Handler for deep dive
  const handleDeepDive = async (topic) => {
    setDeepDiveTopic(topic);
    try {
      const contextNotes = moduleData.notes.join('\n\n');
      const response = await axios.post('http://localhost:5000/api/deep-dive', { originalText: contextNotes, subTopic: topic });
      setDeepDiveContent(prev => prev + '\n\n' + `--- Deeper look into: ${topic} ---\n` + response.data.deeperExplanation);
    } catch (error) {
      alert("Could not generate a deeper explanation.");
    } finally {
      setDeepDiveTopic('');
    }
  };

  // Handler for fetching videos
  const handleFetchVideos = async () => {
    setAreVideosLoading(true);
    try {
      const searchQuery = `${moduleData.title} tutorial`;
      const response = await axios.post('http://localhost:5000/api/fetch-videos', { query: searchQuery });
      if (response.data && response.data.length > 0) {
        setVideos(response.data);
      } else {
        alert("No relevant videos were found for this specific topic.");
      }
    } catch (error) {
      console.error("Failed to fetch videos:", error);
      alert("Sorry, there was an error fetching relevant videos.");
    } finally {
      setAreVideosLoading(false);
    }
  };

  // Handler for quiz generation
  const handleGenerateQuiz = async () => {
    setIsQuizLoading(true);
    setQuizData(null);
    try {
      const response = await axios.post('http://localhost:5000/api/generate-quiz', { lessonTopic: moduleData.title, questionCount: questionCount });
      setQuizData(response.data);
    } catch (error) {
      alert("Sorry, we couldn't generate a quiz right now.");
    } finally {
      setIsQuizLoading(false);
    }
  };

  const deepDiveTopics = moduleData?.deepDiveTopics || [];
  
  if (!moduleData) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-900 border border-gray-700 rounded-lg p-8 min-h-[500px]">
        <p className="text-gray-400 text-xl">Select a module from the roadmap to begin your learning journey.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 md:p-8 space-y-10">
      <h2 className="font-display text-3xl font-bold text-white border-b-2 border-blue-500 pb-2">{moduleData.title}</h2>
      
      <section className="space-y-4">
        {moduleData.notes && moduleData.notes.map((paragraph, index) => (
          <p key={index} className="text-gray-300 whitespace-pre-wrap leading-relaxed">
            {paragraph}
          </p>
        ))}
      </section>

      {deepDiveContent && (
          <section className="bg-gray-800/50 p-4 rounded-lg border border-blue-900/50">
              <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">{deepDiveContent}</p>
          </section>
      )}

      {deepDiveTopics.length > 0 && (
          <section>
              <h3 className="font-bold text-lg text-blue-400 mb-3 flex items-center gap-2"><FaExpandArrowsAlt /> Explore Further</h3>
              <div className="flex flex-wrap gap-3">
                  {deepDiveTopics.map(topic => (
                      <DeepDiveChip key={topic} text={topic} onClick={() => handleDeepDive(topic)} isLoading={deepDiveTopic === topic} />
                  ))}
              </div>
          </section>
      )}

      <section className="border-t border-gray-700 pt-8 space-y-6">
        <h3 className="font-bold text-xl text-blue-400 mb-2 flex items-center gap-2">
          <FaSearch /> Have a Question About This Module?
        </h3>
        {qaHistory.length > 0 && (
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {qaHistory.map((qa, index) => (
              <div key={index} className="space-y-3">
                <div className="flex items-start gap-3 justify-end">
                  <p className="bg-blue-900/50 p-3 rounded-lg border border-blue-700 text-blue-100 max-w-xl">{qa.question}</p>
                  <FaUser className="text-blue-300 mt-2 flex-shrink-0" />
                </div>
                {qa.answer ? (
                  <div className="flex items-start gap-3">
                    <FaRobot className="text-green-400 mt-2 flex-shrink-0" />
                    <p className="bg-green-900/40 p-3 rounded-lg border border-green-800 text-green-200 max-w-xl">{qa.answer}</p>
                  </div>
                ) : (
                  <div className="flex items-start gap-3"><FaRobot className="text-gray-500 mt-2 flex-shrink-0" /><CgSpinner className="animate-spin text-gray-500 mt-2" /></div>
                )}
              </div>
            ))}
          </div>
        )}
        <ModuleSearchBar onSearch={handleModuleSearch} isLoading={isSearchLoading} />
      </section>
      
      <section className="border-t border-gray-700 pt-8">
        <h3 className="font-bold text-xl text-blue-400 mb-4">Visual Learning</h3>
        <button onClick={handleFetchVideos} disabled={areVideosLoading || videos.length > 0} className="bg-red-600/80 text-white font-bold px-5 py-2 rounded-md shadow-lg hover:bg-red-700 transition-all disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center gap-2">
            {areVideosLoading ? <CgSpinner className="animate-spin"/> : <FaYoutube />}
            <span>Show Relevant Videos</span>
        </button>
        {videos.length > 0 && (
          // --- THIS IS THE UPDATED PART FOR LARGER VIDEOS ---
          <div className="grid grid-cols-1 gap-8 mt-6 max-w-150 mx-auto">
            {videos.map(video => <EmbeddedVideo key={video.videoId} {...video} />)}
          </div>
        )}
      </section>

      <section className="border-t border-gray-700 pt-8">
          <h3 className="font-bold text-xl text-blue-400 mb-4 flex items-center gap-2"><FaVial /> Test Your Knowledge</h3>
          <div className="flex items-center gap-4 bg-gray-800/50 p-4 rounded-lg">
            <label htmlFor="question-count" className="text-sm font-medium">Questions:</label>
            <input id="question-count" type="number" value={questionCount} onChange={(e) => setQuestionCount(Math.max(1, parseInt(e.target.value) || 1))} className="bg-gray-900 border border-gray-600 rounded-md w-20 text-center py-2" min="1" max="10" />
            <button onClick={handleGenerateQuiz} disabled={isQuizLoading} className="bg-blue-600 text-white font-bold px-5 py-2 rounded-md shadow-lg hover:bg-blue-700 transition-all disabled:bg-gray-500 disabled:cursor-not-allowed">
                {isQuizLoading ? 'Generating...' : `Generate Quiz`}
            </button>
          </div>
          {quizData && ( <div className="mt-6"><Quiz questions={quizData} /></div> )}
      </section>

      <section className="border-t border-gray-700 pt-8">
        <h3 className="font-bold text-xl text-blue-400 mb-4">Key Term Flashcards</h3>
        {moduleData.flashcards && moduleData.flashcards.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {moduleData.flashcards.map((card, index) => <Flashcard key={index} card={card} />)}
          </div>
        ) : <p className="text-gray-500">No flashcards were generated for this module.</p>}
      </section>
    </div>
  );
}

export default ModuleView;