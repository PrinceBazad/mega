import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { FaBars, FaTimes } from "react-icons/fa";
import "./Navbar.css";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const scrollToSection = (sectionId) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <motion.div
            className="logo-text"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            MegaReality
          </motion.div>
        </Link>

        <div className="navbar-menu">
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
          <motion.button
            className="nav-link"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => scrollToSection("topbuilders")}
          >
            Top Builders
          </motion.button>
          <motion.button
            className="nav-link"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => scrollToSection("agents")}
          >
            Agents
          </motion.button>
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
            <motion.button
              className="mobile-nav-link"
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => scrollToSection("topbuilders")}
            >
              Top Builders
            </motion.button>
            <motion.button
              className="mobile-nav-link"
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => scrollToSection("agents")}
            >
              Agents
            </motion.button>
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
