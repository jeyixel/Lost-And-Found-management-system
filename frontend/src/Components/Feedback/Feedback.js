import React, { useState } from 'react';
import './feedback.css';
import Nav from '../Navbar/Nav';

function Feedback() {
  const [feedbacks, setFeedbacks] = useState([
    {
      id: 1,
      name: "John Doe",
      rating: 4.5,
      date: "2025-04-15",
      comment: "The lost and found system helped me recover my laptop that I left in the conference room. The process was smooth and efficient.",
      avatar: "/api/placeholder/40/40"
    },
    {
      id: 2,
      name: "Sarah Johnson",
      rating: 5,
      date: "2025-04-10",
      comment: "Impressed with how quickly I got my wallet back. The notification system is great, and the staff was very helpful throughout the process.",
      avatar: "/api/placeholder/40/40"
    },
    {
      id: 3,
      name: "Michael Chen",
      rating: 3.5,
      date: "2025-04-05",
      comment: "The system works well, but I think the claim process could be streamlined a bit more. Overall a good experience.",
      avatar: "/api/placeholder/40/40"
    },
    {
      id: 4,
      name: "Emily Wilson",
      rating: 4,
      date: "2025-03-28",
      comment: "I was surprised at how organized everything was. Found my lost headphones within hours of reporting them missing.",
      avatar: "/api/placeholder/40/40"
    },
    {
      id: 5,
      name: "Robert Garcia",
      rating: 5,
      date: "2025-03-20",
      comment: "This is exactly what our office building needed! No more lost items sitting unclaimed for months. The search feature saved me a lot of time.",
      avatar: "/api/placeholder/40/40"
    }
  ]);

  // Function to render stars based on rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={`full-${i}`} className="bi bi-star-fill text-warning"></i>);
    }
    
    // Add half star if needed
    if (hasHalfStar) {
      stars.push(<i key="half" className="bi bi-star-half text-warning"></i>);
    }
    
    // Add empty stars
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="bi bi-star text-warning"></i>);
    }
    
    return stars;
  };

  return (
    <div>
      <Nav/>
      <div className="feedback-container">
        <div className="feedback-header">
          <h1 className="feedback-title">Customer Feedback</h1>
          <p className="feedback-subtitle">Read what our users have to say about our lost and found management system</p>
        </div>
      
        <div className="feedback-stats">
          <div className="card">
            <div className="card-body">
              <div className="row">
                <div className="col-md-4">
                  <div className="stat-item">
                    <h3>4.4</h3>
                    <div className="stars-container">
                      {renderStars(4.4)}
                    </div>
                    <p>Average Rating</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="stat-item">
                    <h3>98%</h3>
                    <p>Success Rate</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="stat-item">
                    <h3>1,254</h3>
                    <p>Items Returned</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      
        <div className="feedback-filter">
          <div className="row">
            <div className="col-md-6">
              <h2 className="feedback-section-title">Recent Reviews</h2>
            </div>
            <div className="col-md-6 text-end">
              <div className="btn-group">
                <button type="button" className="btn btn-outline-primary active">All</button>
                <button type="button" className="btn btn-outline-primary">Positive</button>
                <button type="button" className="btn btn-outline-primary">Critical</button>
              </div>
            </div>
          </div>
        </div>
      
        <div className="feedback-list">
          {feedbacks.map(feedback => (
            <div key={feedback.id} className="feedback-item card mb-4">
              <div className="card-body">
                <div className="feedback-header-row">
                  <div className="feedback-user">
                    <img src={feedback.avatar} alt={feedback.name} className="feedback-avatar" />
                    <div className="feedback-user-info">
                      <h3 className="feedback-name">{feedback.name}</h3>
                      <p className="feedback-date">{feedback.date}</p>
                    </div>
                  </div>
                  <div className="feedback-rating">
                    {renderStars(feedback.rating)}
                    <span className="rating-number">{feedback.rating}</span>
                  </div>
                </div>
                <div className="feedback-comment">
                  <p>{feedback.comment}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      
        <div className="feedback-pagination">
          <nav aria-label="Page navigation">
            <ul className="pagination justify-content-center">
              <li className="page-item disabled">
                <a className="page-link" href="#" tabIndex="-1" aria-disabled="true">Previous</a>
              </li>
              <li className="page-item active"><a className="page-link" href="#">1</a></li>
              <li className="page-item"><a className="page-link" href="#">2</a></li>
              <li className="page-item"><a className="page-link" href="#">3</a></li>
              <li className="page-item">
                <a className="page-link" href="#">Next</a>
              </li>
            </ul>
          </nav>
        </div>
      
        <div className="feedback-form-section">
          <div className="card">
            <div className="card-body">
              <h2 className="feedback-section-title">Leave Your Feedback</h2>
              <form className="feedback-form">
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Your Name</label>
                  <input type="text" className="form-control" id="name" placeholder="Enter your name" />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email Address</label>
                  <input type="email" className="form-control" id="email" placeholder="Enter your email" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Your Rating</label>
                  <div className="rating-selector">
                    <i className="bi bi-star rating-star"></i>
                    <i className="bi bi-star rating-star"></i>
                    <i className="bi bi-star rating-star"></i>
                    <i className="bi bi-star rating-star"></i>
                    <i className="bi bi-star rating-star"></i>
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="comment" className="form-label">Your Comments</label>
                  <textarea className="form-control" id="comment" rows="4" placeholder="Share your experience with our lost and found system"></textarea>
                </div>
                <button type="submit" className="btn btn-primary feedback-submit-btn">Submit Feedback</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Feedback;