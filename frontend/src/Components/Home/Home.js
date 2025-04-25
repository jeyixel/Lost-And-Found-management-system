import React, { useState, useEffect } from 'react';
import Nav from "../Navbar/Nav";
import "./homepage.css";

// importing images
import homebgpic from "./homebgpic.png";
import image2 from "./image2.jpeg";
import image3 from "./image3.jpg"; 

function Home() {
 
  const images = [homebgpic, image2, image3]; // array of images for the slideshow

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Change image every 3 seconds
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div>
      <Nav />
      <div className="homecontent">
        <div className="textcontent">
          <div className='slogan'>
            <p>Your Lost Stuff’s Safe with Us, FindItFast & Relax</p>
          </div>
        </div>
        <div className="imagecontent">
          <img 
            src={images[currentImageIndex]} 
            alt="Slideshow" 
            style={{ width: "100%", height: "auto" }} 
          />
        </div>
      </div>
    </div>
  );
}

export default Home;
