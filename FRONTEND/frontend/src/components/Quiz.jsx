 import { useState } from 'react';

function Quiz({ questions }) {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const handleOptionSelect = (questionIndex, option) => {
    if (showResults) return; // Don't allow changing answers after checking
    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: option,
    });
  };

  const renderResult = (question, questionIndex) => {
    if (!showResults) return null;
    const isCorrect = selectedAnswers[questionIndex] === question.correctAnswer;
    return (
      <p className={`mt-2 text-sm font-bold ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>
        {isCorrect ? 'Correct!' : `Correct Answer: ${question.correctAnswer}`}
      </p>
    );
  };

  return (
    <div className="space-y-6">
      {questions.map((q, index) => (
        <div key={index} className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <p className="font-semibold text-white mb-3">{index + 1}. {q.question}</p>
          
          {/* This is the updated, safer rendering logic */}
          {q.type === 'MCQ' ? (
            <div className="space-y-2">
              {/* Check if q.options exists AND is an array before mapping */}
              {q.options && Array.isArray(q.options) ? (
                q.options.map((option, i) => (
                  <button
                    key={i}
                    onClick={() => handleOptionSelect(index, option)}
                    disabled={showResults}
                    className={`w-full text-left p-3 rounded-md transition-colors text-sm ${
                      selectedAnswers[index] === option 
                      ? 'bg-blue-600 text-white font-semibold' 
                      : 'bg-gray-700 hover:bg-gray-600'
                    } ${showResults ? 'cursor-not-allowed opacity-70' : ''}`}
                  >
                    {option}
                  </button>
                ))
              ) : (
                // Display an error message if options are missing for this question
                <p className="text-sm text-red-400 italic">Error: Could not display options for this question.</p>
              )}
              {renderResult(q, index)}
            </div>
          ) : (
            <div>
              <p className="text-sm text-gray-400">Open-ended question. Reflect and compare with the expected answer.</p>
            </div>
          )}
        </div>
      ))}

      {/* Don't show the check button if there are no questions */}
      {questions && questions.length > 0 && (
        <div className="text-center mt-6">
          <button
            onClick={() => setShowResults(true)}
            disabled={showResults}
            className="bg-green-600 text-white font-bold px-6 py-2 rounded-md shadow-lg hover:bg-green-700 transition-all disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            Check Answers
          </button>
        </div>
      )}
    </div>
  );
}

export default Quiz;