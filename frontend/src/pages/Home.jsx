import React from 'react';
import Header from '../components/Header';
import JobList from '../components/JobList';
import Testimonials from '../components/Testimonials';
import "../styles/Home.css";

const Home = () => {
  return (
    <div>
      <Header />
      <main>
        <JobList />   
        <section className="testimonials">
          <Testimonials />
        </section>
      </main>
      <footer className="footer">
        <p>&copy; 2024 Remote Jobs. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
