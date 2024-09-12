import React from 'react';
import './ControlPanel.css';

const ControlPanel = ({ difficulty, setDifficulty, resetGame }) => {
  return (
    <div className="control-panel">
      <div className="control-group">
        <label htmlFor="difficulty">Difficulty:</label>
        <select
          id="difficulty"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>
      <button onClick={resetGame}>Reset Game</button>
    </div>
  );
};

export default ControlPanel;