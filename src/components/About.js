import React from 'react';

const About = ({ mode }) => {
  const getTextColor = () => {
    return mode === 'light' ? 'black' : 'white';
  };

  return (
    <div style={{ color: getTextColor() }}>
      <h1>About Page</h1>
      <p>This is a Codeforces Contest Generator application.</p>
      <p>It allows you to generate contests based on tags and ratings from Codeforces.</p>
      <p>Explore the various features using the navigation bar.</p>
    </div>
  );
};

export default About;
