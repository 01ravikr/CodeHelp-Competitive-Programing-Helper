const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const codeforcesApi = 'https://codeforces.com/api/';

app.get('/api/codeforces/problems', async (req, res) => {
  const { tags, minRating, maxRating, page = 1, limit = 25 } = req.query;
  try {
    const response = await axios.get(`${codeforcesApi}problemset.problems`, {
      params: { tags }
    });

    // Filter problems by rating range
    const filteredProblems = response.data.result.problems.filter(problem => {
      return problem.rating >= minRating && problem.rating <= maxRating;
    });

    // Paginate filtered problems
    const startIndex = (page - 1) * limit;
    const paginatedProblems = filteredProblems.slice(startIndex, startIndex + limit);

    res.json({ problems: paginatedProblems, totalProblems: filteredProblems.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/codeforces/user_status', async (req, res) => {
  const { handle } = req.query;
  try {
    const response = await axios.get(`${codeforcesApi}user.status`, {
      params: { handle }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.get('/api/codeforces/user_info', async (req, res) => {
  const { handle } = req.query;
  try {
    const response = await axios.get(`${codeforcesApi}user.info`, {
      params: { handles: handle }
    });

    if (response.data.status === 'FAILED') {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    
    const userInfo = response.data.result[0]; // Assuming the first user in the list

    const userStatsResponse = await axios.get(`${codeforcesApi}user.rating`, {
      params: { handle }
    });

    const userStats = userStatsResponse.data.result;

    const lastContest = userStats[userStats.length - 1]; // Assuming the last contest

    const userInfoExtended = {
      rating: userInfo.rating || 'N/A',
      maxRating: userInfo.maxRating || 'N/A',
      contestCount: userStats.length || 'N/A',
      bestRank: userInfo.maxRank || 'N/A',
      bestContestId: userInfo.bestContestId || 'N/A',
      lastContestDate: lastContest ? lastContest.ratingUpdateTimeSeconds : null,
      lastRank: lastContest ? lastContest.rank : 'N/A',
      ratingChange: lastContest ? lastContest.newRating - lastContest.oldRating : 'N/A'
    };

    res.json({ result: userInfoExtended });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

app.get('/api/codeforces/create_contest', async (req, res) => {
  const { minRating, maxRating, handle, count = 5 } = req.query;
  try {
    const response = await axios.get(`${codeforcesApi}problemset.problems`);

    const userProblemsResponse = await axios.get(`${codeforcesApi}user.status`, {
      params: { handle }
    });

    const solvedProblems = new Set(userProblemsResponse.data.result
      .filter(submission => submission.verdict === 'OK')
      .map(submission => `${submission.problem.contestId}-${submission.problem.index}`));

    const problems = response.data.result.problems
      .filter(problem => 
        problem.rating >= parseInt(minRating) && 
        problem.rating <= parseInt(maxRating) &&
        !solvedProblems.has(`${problem.contestId}-${problem.index}`));

    const shuffledProblems = shuffleArray(problems).slice(0, count);

    res.json({ contestProblems: shuffledProblems });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/codeforces/user_stats', async (req, res) => {
  const { handle } = req.query;
  try {
    const userInfoResponse = await axios.get(`${codeforcesApi}user.info`, {
      params: { handles: handle }
    });
    const userStatusResponse = await axios.get(`${codeforcesApi}user.status`, {
      params: { handle }
    });

    if (userInfoResponse.data.status === 'FAILED' || userStatusResponse.data.status === 'FAILED') {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const userInfo = userInfoResponse.data.result[0];
    const submissions = userStatusResponse.data.result;

    const acceptedSolutions = submissions.filter(submission => submission.verdict === 'OK');
    const totalSubmissions = submissions.length;
    const tagsCount = acceptedSolutions.reduce((acc, submission) => {
      submission.problem.tags.forEach(tag => {
        if (!acc[tag]) {
          acc[tag] = 0;
        }
        acc[tag]++;
      });
      return acc;
    }, {});

    const userStats = {
      currentRating: userInfo.rating || 'N/A',
      maxRating: userInfo.maxRating || 'N/A',
      contestCount: userInfo.contestCount || 'N/A',
      totalSubmissions,
      acceptedSolutions: acceptedSolutions.length,
      tagsCount
    };

    res.json({ result: userStats });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
