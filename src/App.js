import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import FilterProblems from './components/FilterProblems';
import HandleComparer from './components/HandleComparer';
import RatingPrediction from './components/RatingPrediction';
import CreateContest from './components/CreateContest';

import About from './components/About';


const App = () => {
  const [mode, setMode] = useState('light');

  const toggleMode = () => {
    if (mode === 'light') {
      setMode('dark');
      document.body.style.backgroundColor = '#042743';
    } else {
      setMode('light');
      document.body.style.backgroundColor = 'white';
    }
  };

  return (
    <Router>
      <div className={`App ${mode}`}>
        <Navbar title="CFvis" mode={mode} toggleMode={toggleMode} />
        <Routes>
           <Route path="/about" element={<About mode={mode} />} /> 
          <Route path="/" element={<Home mode={mode} />} />
          <Route path="/filter-problems" element={<FilterProblems mode={mode} />} />
          <Route path="/handle-comparer" element={<HandleComparer mode={mode} />} />
          <Route path="/rating-prediction" element={<RatingPrediction mode={mode} />} />
          <Route path="/create-contest" element={<CreateContest mode={mode} />} />
          {/* Add more routes as needed */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
