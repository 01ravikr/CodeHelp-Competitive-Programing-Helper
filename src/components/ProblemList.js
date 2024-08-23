// import React from 'react';

// const ProblemList = ({ problems, mode }) => {
//   const getTextColor = () => {
//     return mode === 'light' ? 'black' : 'white';
//   };

//   return (
//     <div>
//       {problems.map((problem) => (
//         <div key={problem.contestId + problem.index} style={{ backgroundColor: mode === 'light' ? 'white' : 'rgb(4 76 101)', color: getTextColor(), padding: '10px', margin: '10px 0', borderRadius: '5px' }}>
//           <a href={`https://codeforces.com/problemset/problem/${problem.contestId}/${problem.index}`} target="_blank" rel="noopener noreferrer" style={{ color: getTextColor() }}>
//             {problem.name} [{problem.rating}]
//           </a>
//           <p>Tags: {problem.tags.join(', ')}</p>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default ProblemList;

import React from "react";
import './CreateContest.css';

const ProblemList = ({ problems, mode, toggleDone }) => {
  const getTextColor = () => {
    return mode === "light" ? "black" : "white";
  };

  return (
    <div>
      <ul className="problem-list" style={{ color: getTextColor() }}>
        {problems.map((problem) => (
          <li
            key={problem.contestId + problem.index}
            style={{ backgroundColor: problem.done ? "#24b619" : "inherit" }}
          >
            <label>
              <input
                type="checkbox"
                checked={problem.done}
                onChange={() => toggleDone(problem.contestId, problem.index)}
              />
              <a
                href={`https://codeforces.com/problemset/problem/${problem.contestId}/${problem.index}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: getTextColor() }}
              >
                {/* {problem.name} [{problem.rating}] */}
                {problem.name} (Rating: {problem.rating || "N/A"})
              </a>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProblemList;
