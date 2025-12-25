import React from "react";
import { Link } from "react-router-dom";
import "./About.css";

const About = () => {
  return (
    <section id="about" className="about">
      <div className="about-container">
        <div className="about-content">
          <div className="about-text">
            <h2>About <span className="highlight">MegaReality</span></h2>
            <p>
              We are a premier real estate agency dedicated to helping you find your dream home. 
              With years of experience in the industry, our team of professionals is committed 
              to providing exceptional service and making your property journey seamless.
            </p>
            <p>
              Our mission is to connect buyers and sellers with the perfect properties, 
              offering personalized solutions and expert guidance every step of the way. 
              We believe in building lasting relationships based on trust and transparency.
            </p>
            <div className="about-stats">
              <div className="stat">
                <h3>500+</h3>
                <p>Properties Sold</p>
              </div>
              <div className="stat">
                <h3>150+</h3>
                <p>Happy Clients</p>
              </div>
              <div className="stat">
                <h3>10+</h3>
                <p>Years Experience</p>
              </div>
            </div>
          </div>
          <div className="about-image">
            <div className="image-placeholder">
              <div className="image-text">About Us Image</div>
            </div>
          </div>
        </div>
        
        <div className="team-section">
          <h3>
            Meet Our <span className="highlight">Agents</span>
          </h3>
          <p>Our dedicated team of professionals is here to help you find your dream property.</p>
          <Link to="#agents" className="btn-view-all" onClick={(e) => {
            e.preventDefault();
            const element = document.getElementById('agents');
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
            }
          }}>
            Meet Our Agents
          </Link>
        </div>
      </div>
    </section>
  );
};

export default About;