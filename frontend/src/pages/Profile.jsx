import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import "../styles/Profile.css";
import { ACCESS_TOKEN } from "../token";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

const MAX_WORDS = 50; // Set a word limit for the company description

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [formData, setFormData] = useState({
    company_name: '',
    company_location: '',
    company_description: '',
    company_logo: null,
  });
  const [editing, setEditing] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false); // State for modal visibility
  const navigate = useNavigate();
  const logoInputRef = useRef(null);

  useEffect(() => {
    fetchProfileAndJobs();
  }, []);

  const fetchProfileAndJobs = async () => {
    try {
        const token = localStorage.getItem(ACCESS_TOKEN);

        // Fetch profile first
        const profileResponse = await api.get('/profiles/me/', { 
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        const profileData = profileResponse.data;
        setProfile(profileData);

        // Fetch jobs associated with the company
        if (profileData.company_name) {
            const jobsResponse = await api.get(`/jobs/company/${profileData.company_name}/`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const jobsData = jobsResponse.data.results;
            setJobs(Array.isArray(jobsData) ? jobsData : []);
        } else {
            setJobs([]);
            console.warn("Company name is undefined, unable to fetch jobs.");
        }

        // Update formData for editing
        setFormData({
            company_name: profileData.company_name || '',
            company_location: profileData.company_location || '',
            company_description: profileData.company_description || '',
            company_logo: profileData.company_logo || null,
        });

    } catch (error) {
        console.error('Error fetching profile and jobs:', error);
        setProfile(null);
        setJobs([]);
    }
  };





  const handleChange = (e) => {
    let { name, value, type, files } = e.target;

    if (name === 'company_description') {
        const words = value.split(/\s+/); // Split by whitespace, not just spaces
        if (words.length > MAX_WORDS) {
            value = words.slice(0, MAX_WORDS).join(' '); // Truncate to the first MAX_WORDS words
        }
    }

    setFormData({
        ...formData,
        [name]: type === 'file' ? files[0] : value,
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('company_name', formData.company_name);
    data.append('company_location', formData.company_location);
    data.append('company_description', formData.company_description);

    if (!profile || formData.company_logo !== profile.company_logo) {
      data.append('company_logo', formData.company_logo);
    }

    try {
      const token = localStorage.getItem(ACCESS_TOKEN);
      if (profile) {
        await api.put(`/profiles/${profile.id}/`, data, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`,
          },
        });
        setSuccess('Profile updated successfully!');
      } else {
        await api.post('/profiles/', data, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`,
          },
        });
        setSuccess('Profile created successfully!');
      }

      setError('');
      setEditing(false); // Close the form after successful submission
      if (logoInputRef.current) {
        logoInputRef.current.value = '';
      }
      await fetchProfileAndJobs(); // Refresh profile and jobs data
      navigate('/profile');
    } catch (error) {
      if (error.response && error.response.data) {
        setError(JSON.stringify(error.response.data));
      } else {
        setError('Failed to save profile. Please try again.');
      }
      setSuccess('');
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem(ACCESS_TOKEN);
      await api.delete(`/profiles/${profile.id}/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setProfile(null);
      setFormData({
        company_name: '',
        company_location: '',
        company_description: '',
        company_logo: null,
      });
      setShowDeleteModal(false); // Close the modal after deletion
    } catch (error) {
      console.error('Error deleting profile:', error);
    }
  };

  const handleAddJobClick = () => {
    navigate('/post-job');
  };

  const handleJobClick = (jobId) => {
    navigate(`/jobs/${jobId}/edit`);
  };

  return (
    <div className="profile-container">
      {profile ? (
        <div>
          {editing ? (
            <form onSubmit={handleSubmit} className="job-form">
              <div>
                <label>Company Name:</label>
                <input
                  type="text"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>Company Location:</label>
                <input
                  type="text"
                  name="company_location"
                  value={formData.company_location}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label>Company Description:</label>
                <textarea
                  name="company_description"
                  value={formData.company_description}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label>Company Logo:</label>
                <input
                  type="file"
                  name="company_logo"
                  onChange={handleChange}
                  ref={logoInputRef}
                />
              </div>
              <button type="submit">Save Changes</button>
            </form>
          ) : (
            <div>
              <div className="profile-header">
                <div>
                  <h1>{profile.company_name}</h1>
                  <p className='location'><FontAwesomeIcon icon={faMapMarkerAlt} /> {profile.company_location}</p>
                  <p>
                    {profile.company_description?.split(/\s+/).length > MAX_WORDS
                      ? `${profile.company_description.split(/\s+/).slice(0, MAX_WORDS).join(' ')}...`
                      : profile.company_description || 'No description available'}
                  </p>


                </div>
                {profile.company_logo && (
                  <img src={profile.company_logo} alt="Company Logo" className="company-logo" />
                )}
              </div>
              <div className="button-group">
                <button className="edit-btn" onClick={() => setEditing(true)}>Edit</button>
                <button className="delete-btn" onClick={() => setShowDeleteModal(true)}>Delete Profile</button> {/* Show the modal */}
                <button className="add-job-btn" onClick={handleAddJobClick}>Add Job</button>
              </div>

              <div className="job-list">
                <h2>My Jobs</h2>
                <ul>
                  {Array.isArray(jobs) && jobs.length > 0 ? (
                    jobs.map((job) => (
                      <li key={job.id} onClick={() => handleJobClick(job.id)}>
                        {job.title} - {job.location}
                      </li>
                    ))
                  ) : (
                    <p>No jobs available</p>
                  )}
                </ul>

              </div>
            </div>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="job-form">
          <div>
            <label>Company Name:</label>
            <input
              type="text"
              name="company_name"
              value={formData.company_name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Company Location:</label>
            <input
              type="text"
              name="company_location"
              value={formData.company_location}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Company Description:</label>
            <textarea
              name="company_description"
              value={formData.company_description}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Company Logo:</label>
            <input
              type="file"
              name="company_logo"
              onChange={handleChange}
              ref={logoInputRef}
            />
          </div>
          <button type="submit">Create Profile</button>
        </form>
      )}

      {/* Modal for confirming profile deletion */}
      {showDeleteModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Are you sure you want to delete your profile?</h2>
            <div className="modal-buttons">
              <button className="confirm-btn" onClick={handleDelete}>Yes, Delete</button>
              <button className="cancel-btn" onClick={() => setShowDeleteModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Display success or error message */}
      {success && <p className="success">{success}</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default Profile;
