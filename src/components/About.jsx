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
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3>Who We Are</h3>
            <p>
              MegaReality is a leading real estate agency with over 15 years of
              experience in helping clients find their dream properties. Our
              team of dedicated professionals is committed to providing
              exceptional service and expert guidance throughout your real
              estate journey.
            </p>
            <p>
              We specialize in residential, commercial, and luxury properties,
              offering comprehensive services from property search to closing.
              Our deep market knowledge and extensive network ensure you get the
              best deals and opportunities.
            </p>

            <motion.div
              className="about-stats"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div className="stat-item">
                <motion.h4
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, type: "spring" }}
                >
                  15+
                </motion.h4>
                <p>Years Experience</p>
              </div>
              <div className="stat-item">
                <motion.h4
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6, type: "spring" }}
                >
                  1000+
                </motion.h4>
                <p>Properties Sold</p>
              </div>
              <div className="stat-item">
                <motion.h4
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.7, type: "spring" }}
                >
                  50+
                </motion.h4>
                <p>Expert Agents</p>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="about-features"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="feature-item"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{
                  scale: 1.03,
                  y: -5,
                  transition: { duration: 0.3 },
                }}
              >
                <motion.div
                  className="feature-icon"
                  whileHover={{
                    scale: 1.1,
                    rotate: [0, 10, -10, 0],
                    transition: { duration: 0.5 },
                  }}
                >
                  {feature.icon}
                </motion.div>
                <div className="feature-content">
                  <h4>{feature.title}</h4>
                  <p>{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.div
          className="team-section"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3>
            Meet Our Expert <span className="highlight">Team</span>
          </h3>
          <div className="team-intro">
            <p>
              Our team of experienced agents is ready to help you find your
              dream property.
            </p>
            <Link to="/agents" className="btn-view-all">
              Meet Our Agents
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
