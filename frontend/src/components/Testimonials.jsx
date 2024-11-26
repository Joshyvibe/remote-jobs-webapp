import React from 'react';
import img1 from '../assets/img1.jpg';
import img2 from '../assets/img2.jpg';
import img3 from '../assets/img3.jpg';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Jane Doe',
      role: 'Software Engineer',
      text: 'This platform is fantastic! I found a great Django job quickly and easily.',
      avatar: img1, // Replace with the actual path to your image
    },
    {
      id: 2,
      name: 'John Smith',
      role: 'Web Developer',
      text: 'A wonderful experience from start to finish. Highly recommended for job seekers and employers.',
      avatar: img3, // Replace with the actual path to your image
    },
    {
      id: 3,
      name: 'Emily Johnson',
      role: 'Tech Lead',
      text: 'The job listings are top-notch, and the application process was seamless.',
      avatar: img2, // Replace with the actual path to your image
    },
  ];

  return (
    <section className="testimonials">
      <h2>Trusted by 10k+ remote workers globally</h2>
      <div className="testimonial-list">
        {testimonials.map(testimonial => (
          <div key={testimonial.id} className="testimonial-item">
            <img
              src={testimonial.avatar}
              alt={testimonial.name}
              className="testimonial-avatar"
            />
            <div className="testimonial-content">
              <p className="testimonial-text">"{testimonial.text}"</p>
              <p className="testimonial-author">
                <strong>{testimonial.name}</strong> - {testimonial.role}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
