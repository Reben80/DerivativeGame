import React from 'react';

const ScoreDisplay = ({ score }) => {
  const getScoreFeedback = (score) => {
    if (score === null) return "Draw your derivative to get a score!";
    if (score >= 90) return "Excellent! You've mastered this derivative!";
    if (score >= 70) return "Good job! You're on the right track.";
    if (score >= 50) return "Not bad, but there's room for improvement.";
    return "Keep practicing! You'll get better with time.";
  };

  return (
    <div className="mt-4 p-4 bg-gray-100 rounded-md">
      <h3 className="text-lg font-semibold mb-2">Score</h3>
      <div className="text-3xl font-bold mb-2">
        {score !== null ? score : '-'}
      </div>
      <p className="text-sm">{getScoreFeedback(score)}</p>
      <div className="mt-4 text-xs">
        <p>Scoring guide:</p>
        <ul className="list-disc list-inside">
          <li>90-100: Excellent understanding</li>
          <li>70-89: Good grasp of the concept</li>
          <li>50-69: Basic understanding</li>
          <li>0-49: Needs more practice</li>
        </ul>
      </div>
    </div>
  );
};

export default ScoreDisplay;