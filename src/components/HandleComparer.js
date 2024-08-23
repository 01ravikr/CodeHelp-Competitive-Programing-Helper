import React, { useState } from 'react';
import axios from 'axios';

const HandleComparer = ({ mode }) => {
  const [handle1, setHandle1] = useState('');
  const [handle2, setHandle2] = useState('');
  const [comparison, setComparison] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const [user1, user2] = await Promise.all([
        axios.get('http://localhost:3001/api/codeforces/user_status', {
          params: { handle: handle1 }
        }),
        axios.get('http://localhost:3001/api/codeforces/user_status', {
          params: { handle: handle2 }
        })
      ]);

      const [info1, info2] = await Promise.all([
        axios.get('http://localhost:3001/api/codeforces/user_info', {
          params: { handle: handle1 }
        }),
        axios.get('http://localhost:3001/api/codeforces/user_info', {
          params: { handle: handle2 }
        })
      ]);

      setComparison({
        user1: {
          ...user1.data.result,
          info: info1.data.result || {} // Provide an empty object as default
        },
        user2: {
          ...user2.data.result,
          info: info2.data.result || {} // Provide an empty object as default
        }
      });
    } catch (error) {
      console.error('Error comparing handles:', error);
    }
  };

  const getTextColor = () => {
    return mode === 'light' ? 'black' : 'white';
  };

  return (
    <div style={{ color: getTextColor() }}>
      <h2>Compare Codeforces Handles</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="handle1" className="mx-2">Handle 1:</label>
        <input
          type="text"
          id="handle1"
          value={handle1}
          onChange={(e) => setHandle1(e.target.value)}
          style={{ backgroundColor: mode === 'light' ? 'white' : 'rgb(4 76 101)', color: getTextColor() }}
        />
        <label htmlFor="handle2" className="mx-2">Handle 2:</label>
        <input
          type="text"
          id="handle2"
          value={handle2}
          onChange={(e) => setHandle2(e.target.value)}
          style={{ backgroundColor: mode === 'light' ? 'white' : 'rgb(4 76 101)', color: getTextColor() }}
        />
        <button type="submit" className="btn btn-primary mx-3">Compare</button>
      </form>
      {comparison && (
        <div id="comparison">
          <h3>Comparison:</h3>
          <p><strong>{handle1}</strong> vs <strong>{handle2}</strong></p>
          <div>
            <h4>{handle1}</h4>
            <ul>
              <li>Rating: {comparison.user1.info?.rating || 'N/A'}</li>
              <li>Max Rating: {comparison.user1.info?.maxRating || 'N/A'}</li>
              <li>Number of Contests: {comparison.user1.info?.contestCount || 'N/A'}</li>
              <li>Best Contest Rank: {comparison.user1.info?.bestRank || 'N/A'} in Contest {comparison.user1.info?.bestContestId || 'N/A'}</li>
              <li>Last Contest:
                {comparison.user1.info?.lastContestDate && (
                  <>
                    <ul>
                    <li >Date: {new Date(comparison.user1.info.lastContestDate * 1000).toLocaleDateString()}</li>
                    <li >Rank: {comparison.user1.info?.lastRank || 'N/A'}</li>
                    <li >Rating Change: {comparison.user1.info?.ratingChange || 'N/A'}</li>
                    </ul>
                  </>
                )}
              </li>
            </ul>
          </div>
          <div>
            <h4>{handle2}</h4>
            <ul>
              <li>Rating: {comparison.user2.info?.rating || 'N/A'}</li>
              <li>Max Rating: {comparison.user2.info?.maxRating || 'N/A'}</li>
              <li>Number of Contests: {comparison.user2.info?.contestCount || 'N/A'}</li>
              <li>Best Contest Rank: {comparison.user2.info?.bestRank || 'N/A'} in Contest {comparison.user2.info?.bestContestId || 'N/A'}</li>
              <li>Last Contest:
                {comparison.user2.info?.lastContestDate && (
                  <>
                    <ul>
                    <li >Date: {new Date(comparison.user2.info.lastContestDate * 1000).toLocaleDateString()}</li>
                    <li >Rank: {comparison.user2.info?.lastRank || 'N/A'}</li>
                    <li >Rating Change: {comparison.user2.info?.ratingChange || 'N/A'}</li>
                    </ul>
                  </>
                )}
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default HandleComparer;
