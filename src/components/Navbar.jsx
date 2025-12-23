import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";
import "./Navbar.css";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    // If we're not on the home page, navigate to home first, then scroll
    if (location.pathname !== "/") {
      window.location.href = `/#${sectionId}`;
      setMobileMenuOpen(false);
      return;
    }

    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
      setMobileMenuOpen(false);
    }
  };

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <motion.div
            className="logo-icon"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            MR
          </motion.div>
          <div className="logo-text">MegaReality</div>
        </Link>

        <div className="navbar-menu desktop">
          <motion.button
            className="nav-link"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => scrollToSection("properties")}
          >
            Properties
          </motion.button>
          <motion.button
            className="nav-link"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => scrollToSection("services")}
          >
            Services
          </motion.button>
          <Link
            to="/agents"
            className="nav-link"
            style={{ textDecoration: "none" }}
          >
            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
              Agents
            </motion.div>
          </Link>
          <motion.button
            className="nav-link"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => scrollToSection("about")}
          >
            About
          </motion.button>
          <motion.button
            className="nav-link"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => scrollToSection("contact")}
          >
            Contact
          </motion.button>
        </div>

        <div className="navbar-actions desktop">
          <Link
            to="/admin/login"
            className="nav-action-btn"
            style={{ textDecoration: "none" }}
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Admin Login
            </motion.div>
          </Link>
        </div>

        <button
          className="navbar-toggle mobile"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {mobileMenuOpen && (
          <div className="mobile-menu">
            <motion.button
              className="mobile-nav-link"
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => scrollToSection("properties")}
            >
              Properties
            </motion.button>
            <motion.button
              className="mobile-nav-link"
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => scrollToSection("services")}
            >
              Services
            </motion.button>
            <Link
              to="/agents"
              className="mobile-nav-link"
              style={{ textDecoration: "none" }}
            >
              <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.98 }}>
                Agents
              </motion.div>
            </Link>
            <motion.button
              className="mobile-nav-link"
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => scrollToSection("about")}
            >
              About
            </motion.button>
            <motion.button
              className="mobile-nav-link"
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => scrollToSection("contact")}
            >
              Contact
            </motion.button>
            <Link
              to="/admin/login"
              className="mobile-action-btn"
              style={{ textDecoration: "none" }}
            >
              <motion.div
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.97 }}
              >
                Admin Login
              </motion.div>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
