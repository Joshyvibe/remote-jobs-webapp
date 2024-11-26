import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import '../styles/Home.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

const JobList = () => {
  const { companyName } = useParams(); 
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage] = useState(10); // Set the number of jobs per page
  const [totalJobs, setTotalJobs] = useState(0);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        let url = `http://localhost:8000/jobs/?page=${currentPage}&page_size=${jobsPerPage}`;
        if (companyName) {
          url = `http://localhost:8000/jobs/company/${companyName}/?page=${currentPage}&page_size=${jobsPerPage}`;
        }
        const response = await axios.get(url);
        setJobs(response.data.results); // assuming your backend returns a paginated response
        setTotalJobs(response.data.count); // assuming your backend returns the total job count
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [companyName, currentPage]);

  const totalPages = Math.ceil(totalJobs / jobsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) return <p>Loading...</p>;

  return (
    <section className="job-list-section">
      <div className="job-list">
        <h1>{companyName ? `Jobs at ${companyName}` : 'Fresh Job Postings 🔥'}</h1>
        
        <p className="pagination-summary">
          {`Showing ${(currentPage - 1) * jobsPerPage + 1} to ${Math.min(currentPage * jobsPerPage, totalJobs)} of ${totalJobs} results`}
        </p>
        
        {jobs.length > 0 ? (
          jobs.map(job => (
            <Link key={job.id} to={`/jobs/${job.id}`} className="job-item-link">
              <div className="job-item">
                {job.company_logo && (
                  <img
                    src={job.company_logo}
                    alt={job.company_name}
                    className="company-logo"
                  />
                )}
                <div className="job-details">
                  <h2>{job.title}</h2>
                  <p><strong>{job.company_name}</strong></p>
                  <p className='location'><FontAwesomeIcon icon={faMapMarkerAlt} /> {job.location}</p>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p>{companyName ? 'No jobs available for this company.' : 'No jobs available.'}</p>
        )}

        <div className="pagination">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              onClick={() => paginate(index + 1)}
              className={currentPage === index + 1 ? 'active' : ''}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
};

export default JobList;
