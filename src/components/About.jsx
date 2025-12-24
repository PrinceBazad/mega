import { motion, useAnimation } from "framer-motion";
import { FaAward, FaUsers, FaHandshake, FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./About.css";

const About = () => {
  const features = [
    {
      icon: <FaAward />,
      title: "Award Winning",
      description: "Recognized for excellence in real estate services",
    },
    {
      icon: <FaUsers />,
      title: "Expert Team",
      description: "50+ experienced real estate professionals",
    },
    {
      icon: <FaHandshake />,
      title: "Trusted Service",
      description: "Over 15 years of reliable service",
    },
    {
      icon: <FaStar />,
      title: "5-Star Rated",
      description: "Highly rated by our satisfied clients",
    },
  ];

  // Animation controls
  const featureControls = useAnimation();

  return (
    <section id="about" className="about">
      <div className="about-container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2>
            About <span className="highlight">MegaReality</span>
          </h2>
          <p>Your trusted partner in finding the perfect property</p>
        </motion.div>

        <div className="about-content">
          <motion.div
            className="about-text"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3>
              Why Choose <span className="highlight">MegaReality</span>?
            </h3>
            <p>
              At MegaReality, we're dedicated to making your property dreams a
              reality. With over 15 years of experience in the real estate
              industry, we've helped thousands of clients find their perfect
              homes and investment opportunities.
            </p>
            <p>
              Our team of expert agents and advisors are here to guide you
              through every step of your property journey, from initial search
              to final purchase. We combine cutting-edge technology with
              personalized service to deliver exceptional results.
            </p>

            {/* Stats */}
            <div className="about-stats">
              <div className="stat-item">
                <h4>1000+</h4>
                <p>Properties Sold</p>
              </div>
              <div className="stat-item">
                <h4>5000+</h4>
                <p>Happy Clients</p>
              </div>
              <div className="stat-item">
                <h4>15+</h4>
                <p>Years Experience</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="about-features"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="feature-item"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="feature-icon">{feature.icon}</div>
                <div className="feature-content">
                  <h4>{feature.title}</h4>
                  <p>{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Team Section */}
        <div className="team-section">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3>
              Meet Our <span className="highlight">Experts</span>
            </h3>
          </motion.div>
          <motion.div
            className="team-intro"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <p>
              Our team of experienced real estate professionals is dedicated to
              helping you find the perfect property. Connect with our experts
              who have extensive knowledge of the local market.
            </p>
            <Link to="/agents" className="btn-view-all">
              Meet Our Experts
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
