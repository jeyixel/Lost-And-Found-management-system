import React, { useState, useEffect } from 'react';
import Nav from "../Navbar/Nav";
import "./homepage.css";

// importing images
import homebgpic from "./homebgpic.png";
import image2 from "./image2.JPG";
import image3 from "./image3.jpg"; 

function Home() {
  const images = [homebgpic, image2, image3]; // array of images for the slideshow
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Set initial visibility after a small delay
    const visibilityTimer = setTimeout(() => {
      setIsVisible(true);
    }, 300);

    // Image rotation logic
    const interval = setInterval(() => {
      // First fade out
      setIsVisible(false);
      
      // Change image after fade out and then fade in
      const imageTimer = setTimeout(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        setIsVisible(true);
      }, 500); // Wait for fade out before changing

      return () => clearTimeout(imageTimer);
    }, 5000); // Change image every 5 seconds
    
    return () => {
      clearInterval(interval);
      clearTimeout(visibilityTimer);
    };
  }, [images.length]);

  return (
    <div className="home-container">
      <Nav />
      <div className="home-content">
        <div className="text-content">
          <div className={`slogan ${isVisible ? 'fade-in' : ''}`}>
            <h1>Your Lost Stuff's Safe with Us</h1>
            <p className="tagline">FindItFast & Relax</p>
            <button className="cta-button">Get Started</button>
          </div>
        </div>
        <div className="image-content">
          <div className={`image-wrapper ${isVisible ? 'slide-in' : ''}`}>
            <img 
              src={images[currentImageIndex]} 
              alt="Slideshow" 
              className="slideshow-image"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;