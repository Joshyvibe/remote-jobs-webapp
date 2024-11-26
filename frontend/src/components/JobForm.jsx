import { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuthentication } from '../auth';
import api from '../api';
import { jwtDecode } from 'jwt-decode';
import { ACCESS_TOKEN } from "../token";

const JobForm = () => {
  const [title, setTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [companyDescription, setCompanyDescription] = useState('');
  const [applicationLink, setApplicationLink] = useState(''); // New state for application link
  const [logo, setLogo] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const logoInputRef = useRef(null);
  const navigate = useNavigate();
  const { isAuthorized } = useAuthentication();
  const [showDeleteModal, setShowDeleteModal] = useState(false); // State for modal visibility

  useEffect(() => {
    const fetchProfile = async () => {
      if (isAuthorized) {
        const token = localStorage.getItem(ACCESS_TOKEN);
        const decoded = jwtDecode(token);
        const userId = decoded.user_id;

        try {
          const response = await api.get(`/profiles/${userId}/`);
          const profile = response.data;

          setCompanyName(profile.company_name || '');
          setLocation(profile.company_location || '');
          setCompanyDescription(profile.company_description || '');
        } catch (error) {
          console.error('Error fetching profile:', error);
          setError('Failed to load profile details.');
        }
      }
    };

    fetchProfile();
  }, [isAuthorized]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('company_name', companyName);
    formData.append('location', location);
    formData.append('description', description);
    formData.append('company_description', companyDescription);
    formData.append('application_link', applicationLink); // Append the application link
    if (logo) formData.append('company_logo', logo);

    try {
      const response = await api.post('/jobs/create/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSuccess('Job posted successfully!');
      setError('');
      // Clear form fields
      setTitle('');
      setCompanyName('');
      setLocation('');
      setDescription('');
      setCompanyDescription('');
      setApplicationLink(''); // Clear the application link field
      setLogo(null);
      if (logoInputRef.current) {
        logoInputRef.current.value = '';
      }
      navigate('/profile');
    } catch (error) {
      setError('Failed to post job. Please try again.');
      setSuccess('');
      console.error('Error posting job:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="job-form">
      <div className="form-section">
        <label className="form-label">
          Title:
          <input 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            required 
            className="form-input"
          />
        </label>
      </div>
      <div className="form-section">
        <label className="form-label">
          Company Name:
          <input 
            type="text" 
            value={companyName} 
            onChange={(e) => setCompanyName(e.target.value)} 
            required 
            className="form-input"
          />
        </label>
      </div>
      <div className="form-section">
        <label className="form-label">
          Location:
          <input 
            type="text" 
            value={location} 
            onChange={(e) => setLocation(e.target.value)} 
            className="form-input"
          />
        </label>
      </div>
      <div className="form-section">
        <label className="form-label">
          Description:
          <textarea 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            required 
            className="form-textarea"
          />
        </label>
      </div>
      <div className="form-section">
        <label className="form-label">
          Company Description:
          <textarea 
            value={companyDescription} 
            onChange={(e) => setCompanyDescription(e.target.value)} 
            className="form-textarea"
          />
        </label>
      </div>
      <div className="form-section">
        <label className="form-label">
          Application Link:
          <input 
            type="url" 
            value={applicationLink} 
            onChange={(e) => setApplicationLink(e.target.value)} 
            placeholder="https://example.com/apply"
            className="form-input"
          />
        </label>
      </div>
      <div className="form-section">
        <label className="form-label">
          Company Logo:
          <input 
            type="file" 
            accept="image/*" 
            onChange={(e) => setLogo(e.target.files[0])} 
            ref={logoInputRef}
            className="form-input-file"
          />
        </label>
      </div>
      {error && <p className="form-error">{error}</p>}
      {success && <p className="form-success">{success}</p>}
      <button type="submit" className="form-submit-btn">Post Job</button>
    </form>
  );
};

export default JobForm;
