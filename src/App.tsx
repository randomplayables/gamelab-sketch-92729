import React, { useState } from 'react';
import './styles.css';

const generateRandomNumber = (): number => Math.floor(Math.random() * 100) + 1;

export default function App() {
  const [targetNumber, setTargetNumber] = useState<number>(generateRandomNumber());
  const [guess, setGuess] = useState<string>('');
  const [feedback, setFeedback] = useState<string>('Guess a number between 1 and 100');
  const [guessCount, setGuessCount] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (gameOver) return;

    const guessInt = parseInt(guess, 10);
    if (isNaN(guessInt) || guessInt < 1 || guessInt > 100) {
      setFeedback('Please enter a valid number between 1 and 100');
      return;
    }

    const newCount = guessCount + 1;
    let newFeedback = '';
    let correct = false;

    if (guessInt < targetNumber) {
      newFeedback = 'Too low!';
    } else if (guessInt > targetNumber) {
      newFeedback = 'Too high!';
    } else {
      newFeedback = `Correct! You guessed it in ${newCount} ${newCount === 1 ? 'try' : 'tries'}.`;
      correct = true;
      setGameOver(true);
    }

    setFeedback(newFeedback);
    setGuessCount(newCount);

    if (typeof window.sendDataToGameLab === 'function') {
      window.sendDataToGameLab({
        event: 'guess',
        guess: guessInt,
        feedback: newFeedback,
        guessCount: newCount,
        correct,
        timestamp: new Date().toISOString(),
      });
    }
  };

  const handleReset = () => {
    setTargetNumber(generateRandomNumber());
    setGuess('');
    setFeedback('Guess a number between 1 and 100');
    setGuessCount(0);
    setGameOver(false);
  };

  return (
    <div className="App">
      <h1>Number Guessing Game</h1>
      <p className="instructions">Try to guess the number I'm thinking of between 1 and 100.</p>

      {!gameOver && (
        <form onSubmit={handleSubmit}>
          <input
            type="number"
            min="1"
            max="100"
            value={guess}
            onChange={e => setGuess(e.target.value)}
            disabled={gameOver}
          />
          <button type="submit" disabled={gameOver || guess === ''}>Guess</button>
        </form>
      )}

      {gameOver && (
        <button onClick={handleReset}>Play Again</button>
      )}

      <div className={`feedback ${gameOver && feedback.startsWith('Correct') ? 'success' : ''}`}>
        {feedback}
      </div>

      {!gameOver && (
        <div className="attempts">Attempts: {guessCount}</div>
      )}
    </div>
  );
}