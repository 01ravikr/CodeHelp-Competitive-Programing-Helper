import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CreateContest.css';

const CreateContest = ({ mode }) => {
  const [minRating, setMinRating] = useState('');
  const [maxRating, setMaxRating] = useState('');
  const [handle, setHandle] = useState('');
  const [contestProblems, setContestProblems] = useState([]);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState('');
  const [countdown, setCountdown] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get('http://localhost:3001/api/codeforces/create_contest', {
        params: { minRating, maxRating, handle }
      });
      setContestProblems(response.data.contestProblems.map(problem => ({
        ...problem,
        done: false
      })));
      setError('');
    } catch (error) {
      console.error('Error creating contest:', error);
      setError('Failed to create contest. Please try again.');
    }
  };

  const handleCheckboxChange = (contestId, index) => {
    setContestProblems(prevProblems => 
      prevProblems.map(problem => 
        problem.contestId === contestId && problem.index === index
          ? { ...problem, done: !problem.done }
          : problem
      )
    );
  };

  const handleStartTimer = () => {
    if (timer) {
      setCountdown(parseInt(timer) * 60);
    }
  };

  useEffect(() => {
    let timerInterval;
    if (countdown !== null) {
      timerInterval = setInterval(() => {
        setCountdown(prevCountdown => {
          if (prevCountdown <= 1) {
            clearInterval(timerInterval);
            return null;
          }
          return prevCountdown - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timerInterval);
  }, [countdown]);

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const getTextColor = () => {
    return mode === 'light' ? 'black' : 'white';
  };

  return (
    <div style={{ color: getTextColor() }}>
      <h2>Create Contest</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="minRating">Minimum Rating:</label>
        <input
          type="number"
          id="minRating"
          value={minRating}
          onChange={(e) => setMinRating(e.target.value)}
          style={{ backgroundColor: mode === 'light' ? 'white' : 'rgb(4 76 101)', color: getTextColor() }}
        />
        <label htmlFor="maxRating">Maximum Rating:</label>
        <input
          type="number"
          id="maxRating"
          value={maxRating}
          onChange={(e) => setMaxRating(e.target.value)}
          style={{ backgroundColor: mode === 'light' ? 'white' : 'rgb(4 76 101)', color: getTextColor() }}
        />
        <label htmlFor="handle">Codeforces Handle (optional):</label>
        <input
          type="text"
          id="handle"
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
          style={{ backgroundColor: mode === 'light' ? 'white' : 'rgb(4 76 101)', color: getTextColor() }}
        />
        <button type="submit" className="btn btn-primary mx-3">Create Contest</button>
      </form>
      {contestProblems.length > 0 && (
        <div>
          <h3>Selected Problems for Contest:</h3>
          <ul className="problem-list" style={{ color: getTextColor() }}>
            {contestProblems.map((problem, index) => (
              <li key={`${problem.contestId}${problem.index}`} className={problem.done ? 'checked' : ''}>
                <input
                  type="checkbox"
                  checked={problem.done}
                  onChange={() => handleCheckboxChange(problem.contestId, problem.index)}
                />
                <a href={`https://codeforces.com/problemset/problem/${problem.contestId}/${problem.index}`} target="_blank" rel="noopener noreferrer">
                  {`${problem.name} - Rating: ${problem.rating}`}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div>
        <h3>Set Timer for Contest:</h3>
        <label htmlFor="timer">Enter time in minutes:</label>
        <input
          type="number"
          id="timer"
          value={timer}
          onChange={(e) => setTimer(e.target.value)}
          style={{ backgroundColor: mode === 'light' ? 'white' : 'rgb(4 76 101)', color: getTextColor() }}
        />
        <button onClick={handleStartTimer} className="btn btn-primary mx-3">Start</button>
        {countdown !== null && (
          <div>
            <h4>Time Remaining: {formatTime(countdown)}</h4>
          </div>
        )}
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default CreateContest;
