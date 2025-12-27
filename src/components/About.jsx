import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import API_BASE_URL from "../config";
import "./About.css";

const About = () => {
  const [aboutContent, setAboutContent] = useState({
    title: "About MegaReality",
    description:
      "We are a leading real estate company dedicated to helping you find your perfect property. With years of experience and a commitment to excellence, we make your property dreams come true.",
    image:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
  });

  useEffect(() => {
    const fetchAboutContent = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/admin/home-content`);
        if (response.ok) {
          const data = await response.json();
          setAboutContent(data.about);
        }
      } catch (error) {
        console.error("Error fetching about content:", error);
      }
    };

    fetchAboutContent();

    // Listen for home content updates
    const handleHomeContentUpdate = (event) => {
      if (event.detail.section === "about") {
        setAboutContent((prev) => ({
          ...prev,
          ...event.detail.content,
        }));
      }
    };

    window.addEventListener("homeContentUpdated", handleHomeContentUpdate);

    return () => {
      window.removeEventListener("homeContentUpdated", handleHomeContentUpdate);
    };
  }, []);
  return (
    <section id="about" className="about">
      <div className="about-container">
        <div className="about-content">
          <div className="about-text">
            <motion.h2
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {aboutContent.title}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              {aboutContent.description}
            </motion.p>
            <motion.div
              className="about-stats"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
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
            </motion.div>
          </div>
          <div className="about-image">
            <motion.div
              className="about-image-content"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <img src={aboutContent.image} alt="About MegaReality" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
