import React, { useState } from 'react';
import axios from 'axios';
import ProblemList from './ProblemList';

const FilterProblems = ({ mode }) => {
  const [tags, setTags] = useState('');
  const [minRating, setMinRating] = useState('');
  const [maxRating, setMaxRating] = useState('');
  const [handle, setHandle] = useState('');
  const [problems, setProblems] = useState([]);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalProblems, setTotalProblems] = useState(0);
  const limit = 25;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPage(1);
    fetchProblems(1);
  };

  const fetchProblems = async (pageNumber) => {
    try {
      const response = await axios.get('http://localhost:3001/api/codeforces/problems', {
        params: { tags, minRating, maxRating, page: pageNumber, limit }
      });

      const fetchedProblems = response.data.problems.map(problem => ({
        ...problem,
        done: false
      }));

      if (handle) {
        await fetchUserSubmissions(fetchedProblems);
      } else {
        setProblems(fetchedProblems);
      }

      setTotalProblems(response.data.totalProblems);
      setError('');
    } catch (error) {
      console.error('Error fetching problems:', error);
      setError('Failed to fetch problems. Please try again.');
    }
  };

  const fetchUserSubmissions = async (fetchedProblems) => {
    try {
      const response = await axios.get('http://localhost:3001/api/codeforces/user_status', {
        params: { handle }
      });

      const solvedProblems = new Set(
        response.data.result
          .filter(submission => submission.verdict === 'OK')
          .map(submission => `${submission.problem.contestId}${submission.problem.index}`)
      );

      const updatedProblems = fetchedProblems.map(problem => ({
        ...problem,
        done: solvedProblems.has(`${problem.contestId}${problem.index}`)
      }));

      setProblems(updatedProblems);
    } catch (error) {
      console.error('Error fetching user submissions:', error);
      setError('Failed to fetch user submissions. Please try again.');
    }
  };

  const handleNextPage = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchProblems(nextPage);
  };

  const handlePrevPage = () => {
    const prevPage = page - 1;
    setPage(prevPage);
    fetchProblems(prevPage);
  };

  const toggleDone = (contestId, index) => {
    setProblems((prevProblems) =>
      prevProblems.map((problem) =>
        problem.contestId === contestId && problem.index === index
          ? { ...problem, done: !problem.done }
          : problem
      )
    );
  };

  const getTextColor = () => {
    return mode === 'light' ? 'black' : 'white';
  };

  return (
    <div style={{ color: getTextColor() }}>
      <h2  style={{marginBottom : "20px"}}>Filter Problems by Rating</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="tags" className="mx-2">Tags (comma separated):</label>
        <input
          type="text"
          id="tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          style={{ backgroundColor: mode === 'light' ? 'white' : 'rgb(4 76 101)', color: getTextColor() }}
        />
        <label htmlFor="minRating" className="mx-2">Min Rating:</label>
        <input
          type="number"
          id="minRating"
          value={minRating}
          onChange={(e) => setMinRating(e.target.value)}
          style={{ backgroundColor: mode === 'light' ? 'white' : 'rgb(4 76 101)', color: getTextColor() }}
        />
        <label htmlFor="maxRating" className="mx-2">Max Rating:</label>
        <input
          type="number"
          id="maxRating"
          value={maxRating}
          onChange={(e) => setMaxRating(e.target.value)}
          style={{ backgroundColor: mode === 'light' ? 'white' : 'rgb(4 76 101)', color: getTextColor() }}
        />
        <br />
        <h4 style={{marginTop : "20px"}}>Enter Your codeforces handle to see if problems are already solved:</h4>
        <label htmlFor="handle" className="mx-2" >Codeforces Handle:</label>
        <input
          type="text"
          id="handle"
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
          style={{ backgroundColor: mode === 'light' ? 'white' : 'rgb(4 76 101)', color: getTextColor() }}
        />
        <button type="submit" className="btn btn-primary mx-3">Generate</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p>Total Problems: {totalProblems}</p>
      <ProblemList problems={problems} mode={mode} toggleDone={toggleDone} />
      <div>
        <button onClick={handlePrevPage} disabled={page === 1} className="btn btn-primary mx-1">Previous</button>
        <button onClick={handleNextPage} disabled={problems.length < limit} className="btn btn-primary mx-1">Next</button>
      </div>
    </div>
  );
};

export default FilterProblems;
