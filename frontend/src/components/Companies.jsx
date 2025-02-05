import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import "../styles/Companies.css";

// function to limit words in a string
const truncateWords = (text, numWords) => {
  const words = text.split(' ');
  if (words.length > numWords) {
    return words.slice(0, numWords).join(' ') + '...';
  }
  return text;
};

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [companiesPerPage] = useState(10); /
  const [totalCompanies, setTotalCompanies] = useState(0);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await api.get(`/companies/?page=${currentPage}&page_size=${companiesPerPage}`);
        console.log(response.data);
        setCompanies(response.data.results);
        setTotalCompanies(response.data.count); 
      } catch (error) {
        console.error('Error fetching companies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, [currentPage, companiesPerPage]);

  const totalPages = Math.ceil(totalCompanies / companiesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="companies-container">
      <h1>Listed Companies</h1>
      
      <p>
        {`Showing ${(currentPage - 1) * companiesPerPage + 1} to ${Math.min(currentPage * companiesPerPage, totalCompanies)} of ${totalCompanies} results`}
      </p>
      {companies.length === 0 ? (
        <p>No companies available.</p>
      ) : (
        <div className="company-list">
          {companies.map((company) => (
            <Link to={`/company/${company.company_name}/jobs`} key={company.id} className="company-card-link">
              <div className="company-card">
                {company.company_logo && (
                  <img src={company.company_logo} alt={`${company.company_name} logo`} className="company-logo" />
                )}
                <div className="company-details">
                  <h2>{company.company_name}</h2>
                  <h5>Actively Hiring</h5>
                  <p>{truncateWords(company.company_description, 20)}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
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
  );
};

export default Companies;
