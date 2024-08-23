import React, { useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const Home = ({ mode }) => {
  const [handle, setHandle] = useState('');
  const [userStats, setUserStats] = useState(null);
  const [error, setError] = useState('');

  const getTextColor = () => {
    return mode === 'light' ? 'black' : 'white';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get('http://localhost:3001/api/codeforces/user_stats', {
        params: { handle }
      });
      setUserStats(response.data.result);
      setError('');
    } catch (error) {
      console.error('Error fetching user stats:', error);
      setError('Failed to fetch user stats. Please try again.');
    }
  };

  const COLORS = [
    '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AA4643', '#4572A7', '#A0522D', '#5F9EA0', '#D2691E', '#FF7F50', 
    '#6495ED', '#DC143C', '#00FFFF', '#00008B', '#008B8B', '#B8860B', '#A9A9A9', '#006400', '#BDB76B', '#8B008B', 
    '#556B2F', '#FF8C00', '#9932CC', '#8B0000', '#E9967A', '#8FBC8F', '#483D8B', '#2F4F4F', '#00CED1', '#9400D3', 
    '#FF1493', '#00BFFF', '#696969', '#1E90FF', '#B22222', '#FFFAF0', '#228B22', '#FF00FF', '#DCDCDC', '#F8F8FF', 
    '#FFD700', '#DAA520', '#808080', '#008000', '#ADFF2F', '#F0FFF0', '#FF69B4', '#CD5C5C', '#4B0082', '#FFFFF0', 
    '#F0E68C', '#E6E6FA', '#FFF0F5', '#7CFC00', '#FFFACD', '#ADD8E6', '#F08080', '#E0FFFF', '#FAFAD2', '#D3D3D3', 
    '#90EE90', '#FFB6C1', '#FFA07A', '#20B2AA', '#87CEFA', '#778899', '#B0C4DE', '#FFFFE0', '#00FF00', '#32CD32', 
    '#FAF0E6', '#FF00FF', '#800000', '#66CDAA', '#0000CD', '#BA55D3', '#9370DB', '#3CB371', '#7B68EE', '#00FA9A', 
    '#48D1CC', '#C71585', '#191970', '#F5FFFA', '#FFE4E1', '#FFE4B5', '#FFDEAD', '#000080', '#FDF5E6', '#808000', 
    '#6B8E23', '#FFA500', '#FF4500', '#DA70D6', '#EEE8AA', '#98FB98', '#AFEEEE', '#DB7093', '#FFEFD5', '#FFDAB9'
  ];
  

  return (
    <div style={{ color: getTextColor() }}>
      <h1>Home Page</h1>
      <p>Welcome to the CF Visualiser. Where you can filter problems by rating and you will be able to compare handles.</p>
      <form onSubmit={handleSubmit}>
        <label htmlFor="handle">Enter Codeforces Handle:</label>
        <input
          type="text"
          id="handle"
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
          style={{ backgroundColor: mode === 'light' ? 'white' : 'rgb(4 76 101)', color: getTextColor() }}
        />
        <button type="submit" className="btn btn-primary mx-3">Submit</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {userStats && (
        <div>
          <h2>Profile Information</h2>
          <table>
            <tbody>
              <tr>
                <td>Current Rating:</td>
                <td>{userStats.currentRating}</td>
              </tr>
              <tr>
                <td>Max Rating:</td>
                <td>{userStats.maxRating}</td>
              </tr>
              {/* <tr>
                <td>Number of Contests:</td>
                <td>{userStats.contestCount}</td>
              </tr> */}
              <tr>
                <td>Total Submissions:</td>
                <td>{userStats.totalSubmissions}</td>
              </tr>
              <tr>
                <td>Accepted Solutions:</td>
                <td>{userStats.acceptedSolutions}</td>
              </tr>
            </tbody>
          </table>
          <h3 style={{marginBottom : '10px' , marginTop : '10px'}}>Tags of Solved Problems</h3>
          <ul >
            {Object.entries(userStats.tagsCount).map(([tag, count]) => (
              <li key={tag}>{tag}: {count}</li>
            ))}
          </ul>
          <h3 className=" " style={{marginBottom : '1px'}}>Problem Tags Distribution</h3>
          <PieChart width={500} height={500} >
            <Pie 
              data={Object.entries(userStats.tagsCount).map(([tag, count]) => ({ name: tag, value: count }))}
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label
             
            >
              {Object.entries(userStats.tagsCount).map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      )}
    </div>
  );
};

export default Home;
