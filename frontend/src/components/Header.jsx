import React from 'react';
import '../styles/Header.css';
import { Link } from 'react-router-dom';



const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <h1>The Ultimate Solution </h1>
        <h1>For Finding Corporate Jobs</h1>
        <p>Explore our curated selection of top-tier Corporate job opportunities.</p>
        <Link to="/login">
          <button className="post-job-button">Post a job! It's free!</button>
        </Link>
      </div>
      <div className="gradient-circles"></div>
    </header>
  );
};

export default Header;
