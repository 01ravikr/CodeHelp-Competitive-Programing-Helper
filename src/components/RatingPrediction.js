import React, { useState } from 'react';
import axios from 'axios';

const RatingPrediction = ({ mode }) => {
  const [contestId, setContestId] = useState('');
  const [rank, setRank] = useState('');
  const [predictedRatingChange, setPredictedRatingChange] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get('http://localhost:3001/api/codeforces/rating_prediction', {
        params: { contestId, rank }
      });
      setPredictedRatingChange(response.data.predictedRatingChange);
      setError('');
    } catch (error) {
      console.error('Error fetching rating prediction:', error);
      setError('Failed to fetch rating prediction. Please try again.');
    }
  };

  const getTextColor = () => {
    return mode === 'light' ? 'black' : 'white';
  };

  return (
    <div style={{ color: getTextColor() }}>
      <h2>Rating Prediction in Contest</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="contestId">Contest ID:</label>
        <input
          type="text"
          id="contestId"
          value={contestId}
          onChange={(e) => setContestId(e.target.value)}
          style={{ backgroundColor: mode === 'light' ? 'white' : 'rgb(4 76 101)', color: getTextColor() }}
        />
        <label htmlFor="rank">Your Rank:</label>
        <input
          type="number"
          id="rank"
          value={rank}
          onChange={(e) => setRank(e.target.value)}
          style={{ backgroundColor: mode === 'light' ? 'white' : 'rgb(4 76 101)', color: getTextColor() }}
        />
        <button type="submit" className="btn btn-primary mx-3">Predict Rating Change</button>
      </form>
      {predictedRatingChange !== null && (
        <p>Predicted Rating Change: {predictedRatingChange}</p>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default RatingPrediction;
