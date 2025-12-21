import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import "./Navbar.css";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
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
          <div className="logo-icon">MR</div>
          <div className="logo-text">MegaReality</div>
        </Link>

        <div className="navbar-menu desktop">
          <button
            className="nav-link"
            onClick={() => scrollToSection("properties")}
          >
            Properties
          </button>
          <button
            className="nav-link"
            onClick={() => scrollToSection("services")}
          >
            Services
          </button>
          <Link to="/agents" className="nav-link">
            Agents
          </Link>
          <button className="nav-link" onClick={() => scrollToSection("about")}>
            About
          </button>
          <button
            className="nav-link"
            onClick={() => scrollToSection("contact")}
          >
            Contact
          </button>
        </div>

        <div className="navbar-actions desktop">
          <Link to="/admin/login" className="nav-action-btn">
            Admin Login
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
            <button
              className="mobile-nav-link"
              onClick={() => scrollToSection("properties")}
            >
              Properties
            </button>
            <button
              className="mobile-nav-link"
              onClick={() => scrollToSection("services")}
            >
              Services
            </button>
            <Link to="/agents" className="mobile-nav-link">
              Agents
            </Link>
            <button
              className="mobile-nav-link"
              onClick={() => scrollToSection("about")}
            >
              About
            </button>
            <button
              className="mobile-nav-link"
              onClick={() => scrollToSection("contact")}
            >
              Contact
            </button>
            <Link to="/admin/login" className="mobile-action-btn">
              Admin Login
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
