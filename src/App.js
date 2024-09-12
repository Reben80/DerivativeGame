import React, { useState, useCallback } from 'react';
import ControlPanel from './components/ControlPanel';
import GameBoard from './components/GameBoard';
import './App.css';

function App() {
  const [difficulty, setDifficulty] = useState('easy');
  const [functionType, setFunctionType] = useState('linear');
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(null);
  const [resetTrigger, setResetTrigger] = useState(0);

  const functionTypes = ['linear', 'quadratic', 'cubic', 'sin', 'cos', 'tan', 'exp', 'composite'];

  const resetGame = useCallback(() => {
    setScore(null);
    setShowAnswer(false);
    setResetTrigger(prev => prev + 1);
  }, []);

  const handleDifficultyChange = useCallback((newDifficulty) => {
    setDifficulty(newDifficulty);
    resetGame();
  }, [resetGame]);

  return (
    <div className="app">
      <header>
        <h1>DerivArt: Master the Curve</h1>
        <p>Sketch the derivative and prove your calculus prowess!</p>
      </header>
      <main>
        <ControlPanel
          difficulty={difficulty}
          setDifficulty={handleDifficultyChange}
          resetGame={resetGame}
        />
        <GameBoard
          difficulty={difficulty}
          functionType={functionType}
          showAnswer={showAnswer}
          setShowAnswer={setShowAnswer}
          setScore={setScore}
          score={score}
          resetTrigger={resetTrigger}
        />
        <select value={functionType} onChange={(e) => setFunctionType(e.target.value)}>
          {functionTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        <button onClick={() => setShowAnswer(!showAnswer)}>
          {showAnswer ? 'Hide Answer' : 'Show Answer'}
        </button>
        {score !== null && (
          <div className="score-display">
            <h2>Your Score: {score}</h2>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;