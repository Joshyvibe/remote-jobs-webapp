import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN } from '../token';
import '../styles/Home.css';

const JobEdit = () => {
  const { id } = useParams(); // Get the job ID from the URL
  const navigate = useNavigate(); // For navigation after submission
  const [job, setJob] = useState({
    title: '',
    location: '',
    description: '',
    company_name: '',
    company_location: '',
    company_description: '',
    company_logo: null, // Initialized as null
    application_link: '', // New state for application link
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state

  // Get token from localStorage
  const token = localStorage.getItem(ACCESS_TOKEN);

  useEffect(() => {
    const fetchJobDetail = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/jobs/${id}/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setJob({
          title: response.data.title,
          location: response.data.location,
          description: response.data.description,
          company_name: response.data.company_name,
          company_location: response.data.company_location,
          company_description: response.data.company_description,
          company_logo: response.data.company_logo, // Handle this if it's a URL or a file
          application_link: response.data.application_link || '',
        });
      } catch (error) {
        console.error('Error fetching job details:', error);
        setError('Failed to load job details.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetail();
  }, [id, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJob((prevJob) => ({
      ...prevJob,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setJob((prevJob) => ({
      ...prevJob,
      company_logo: e.target.files[0], // Handle file input
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    // Append form fields to FormData
    Object.keys(job).forEach((key) => {
      if (key === 'company_logo') {
        // Only append if company_logo is a File
        if (job[key] instanceof File) {
          formData.append(key, job[key]);
        }
      } else {
        formData.append(key, job[key]);
      }
    });

    try {
      await axios.put(`http://localhost:8000/jobs/${id}/`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      navigate(`/jobs/${id}/`); // Redirect to the job detail page after successful edit
    } catch (error) {
      console.error('Error updating job:', error.response.data);
      setError('Failed to update job. Please try again.');
    }
  };

  const handleDeleteClick = () => {
    setIsModalOpen(true); // Open modal on delete button click
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8000/jobs/${id}/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      navigate('/profile'); // Redirect to profile after successful deletion
    } catch (error) {
      console.error('Error deleting job:', error);
      setError('Failed to delete job. Please try again.');
    } finally {
      setIsModalOpen(false); // Close modal after deletion
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false); // Close modal on cancel
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <form className="job-form" onSubmit={handleSubmit}>
        <h1>Edit Job</h1>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={job.title}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="location">Location:</label>
          <input
            type="text"
            id="location"
            name="location"
            value={job.location}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={job.description}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="company_name">Company Name:</label>
          <input
            type="text"
            id="company_name"
            name="company_name"
            value={job.company_name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="company_location">Company Location:</label>
          <input
            type="text"
            id="company_location"
            name="company_location"
            value={job.company_location}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="company_description">Company Description:</label>
          <textarea
            id="company_description"
            name="company_description"
            value={job.company_description}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="company_logo">Company Logo:</label>
          <input
            type="file"
            id="company_logo"
            name="company_logo"
            onChange={handleFileChange}
          />
          {job.company_logo && !(job.company_logo instanceof File) && (
            <img
              src={job.company_logo} // Assuming this is a URL for an existing image
              alt="Company Logo Preview"
              style={{ maxWidth: '200px', maxHeight: '200px' }}
            />
          )}
        </div>
        <div>
          <label htmlFor="application_link">Application Link:</label>
          <input
            type="url"
            id="application_link"
            name="application_link"
            value={job.application_link}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Save Changes</button>
        <button type="button" className="delete-btn" onClick={handleDeleteClick}>Delete Job</button>
      </form>
      {/* Modal for confirmation */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <p>Are you sure you want to delete this job?</p>
            <button onClick={handleDelete}>Yes, delete</button>
            <button onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobEdit;
