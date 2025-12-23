import { motion } from 'framer-motion';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <motion.div
            className="footer-section"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="footer-logo">
              <span className="logo-icon">MR</span>
              <span className="logo-text">MegaReality</span>
            </div>
            <p className="footer-description">
              Your trusted partner in finding the perfect property. 
              We make real estate simple, transparent, and rewarding.
            </p>
            <div className="social-links">
              <motion.a 
                href="#" 
                aria-label="Facebook"
                whileHover={{ scale: 1.2, color: '#1877f2' }}
              >
                <FaFacebook />
              </motion.a>
              <motion.a 
                href="#" 
                aria-label="Twitter"
                whileHover={{ scale: 1.2, color: '#1da1f2' }}
              >
                <FaTwitter />
              </motion.a>
              <motion.a 
                href="#" 
                aria-label="Instagram"
                whileHover={{ scale: 1.2, color: '#e4405f' }}
              >
                <FaInstagram />
              </motion.a>
              <motion.a 
                href="#" 
                aria-label="LinkedIn"
                whileHover={{ scale: 1.2, color: '#0077b5' }}
              >
                <FaLinkedin />
              </motion.a>
            </div>
          </motion.div>

          <motion.div
            className="footer-section"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3>Quick Links</h3>
            <ul className="footer-links">
              <li><button onClick={() => scrollToSection('home')}>Home</button></li>
              <li><button onClick={() => scrollToSection('properties')}>Properties</button></li>
              <li><button onClick={() => scrollToSection('about')}>About Us</button></li>
              <li><button onClick={() => scrollToSection('contact')}>Contact</button></li>
            </ul>
          </motion.div>

          <motion.div
            className="footer-section"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3>Contact Info</h3>
            <ul className="footer-contact">
              <li>
                <FaMapMarkerAlt />
                <span>123 Real Estate Ave, City, ST 12345</span>
              </li>
              <li>
                <FaPhone />
                <a href="tel:+15551234567">+1 (555) 123-4567</a>
              </li>
              <li>
                <FaEnvelope />
                <a href="mailto:info@megareality.com">info@megareality.com</a>
              </li>
            </ul>
          </motion.div>
        </div>

        <motion.div
          className="footer-bottom"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p>&copy; {currentYear} MegaReality. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <span>|</span>
            <a href="#">Terms of Service</a>
            <span>|</span>
            <a href="#">Cookie Policy</a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;