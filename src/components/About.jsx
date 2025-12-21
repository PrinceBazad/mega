import { motion, useAnimation } from 'framer-motion';
import { FaAward, FaUsers, FaHandshake, FaStar } from 'react-icons/fa';
import './About.css';

const About = () => {
  const agents = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Senior Agent',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80',
      sales: '150+ Properties Sold'
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Property Expert',
      image: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=400&q=80',
      sales: '200+ Properties Sold'
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      role: 'Luxury Specialist',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80',
      sales: '120+ Properties Sold'
    },
    {
      id: 4,
      name: 'David Park',
      role: 'Commercial Agent',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80',
      sales: '180+ Properties Sold'
    }
  ];

  const features = [
    {
      icon: <FaAward />,
      title: 'Award Winning',
      description: 'Recognized for excellence in real estate services'
    },
    {
      icon: <FaUsers />,
      title: 'Expert Team',
      description: '50+ experienced real estate professionals'
    },
    {
      icon: <FaHandshake />,
      title: 'Trusted Service',
      description: 'Over 15 years of reliable service'
    },
    {
      icon: <FaStar />,
      title: '5-Star Rated',
      description: 'Highly rated by our satisfied clients'
    }
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
          <h2>About <span className="highlight">MegaReality</span></h2>
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
              MegaReality is a leading real estate agency with over 15 years of experience 
              in helping clients find their dream properties. Our team of dedicated professionals 
              is committed to providing exceptional service and expert guidance throughout your 
              real estate journey.
            </p>
            <p>
              We specialize in residential, commercial, and luxury properties, offering 
              comprehensive services from property search to closing. Our deep market knowledge 
              and extensive network ensure you get the best deals and opportunities.
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
                  transition: { duration: 0.3 }
                }}
              >
                <motion.div 
                  className="feature-icon"
                  whileHover={{
                    scale: 1.1,
                    rotate: [0, 10, -10, 0],
                    transition: { duration: 0.5 }
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
          <h3>Meet Our Expert <span className="highlight">Team</span></h3>
          <div className="team-grid">
            {agents.map((agent, index) => (
              <motion.div
                key={agent.id}
                className="agent-card"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ 
                  y: -15,
                  boxShadow: "0 25px 50px rgba(0,0,0,0.15)",
                  transition: { duration: 0.3 }
                }}
              >
                <div className="agent-image">
                  <motion.img 
                    src={agent.image} 
                    alt={agent.name}
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <div className="agent-info">
                  <h4>{agent.name}</h4>
                  <p className="agent-role">{agent.role}</p>
                  <p className="agent-sales">{agent.sales}</p>
                  
                  <motion.button
                    className="agent-contact-btn"
                    whileHover={{ 
                      scale: 1.05,
                      backgroundColor: "#764ba2"
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Contact Agent
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;