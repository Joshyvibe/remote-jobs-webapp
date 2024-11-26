import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const JobDetail = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobDetail = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/jobs/${id}/`);
        setJob(response.data);
      } catch (error) {
        console.error('Error fetching job details:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchJobDetail();
  }, [id]);
  

  if (loading) return <p>Loading...</p>;
  if (!job) return <p>Job not found.</p>;

  // Calculate the number of days ago the job was posted
  const calculateDaysAgo = (postDate) => {
    const currentDate = new Date();
    const postDateObj = new Date(postDate);
    const differenceInTime = currentDate - postDateObj;
    const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));
    return differenceInDays;
  };

  // Get the number of days ago the job was posted
  const daysAgo = calculateDaysAgo(job.post_date);

  return (
    <div className="job-detail">
      <div className="job-header">
        <h1 className="job-title">{job.title}</h1>
        <p className="job-posted">Posted {daysAgo} {daysAgo === 1 ? 'day' : 'days'} ago</p>
      </div>
      <p className="job-location"><strong>Hiring at </strong> {job.location}</p>
      <div className="job-description">
        <strong>Description:</strong>
        <p>{job.description}</p>
      </div>
      <div className="job-description">
        <a href={job.application_link} className="apply-button" target="_blank" rel="noopener noreferrer">
          Apply Here
        </a>
      </div>

    </div>
  );
};

export default JobDetail;
