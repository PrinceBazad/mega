import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaHome,
  FaHandshake,
  FaChartLine,
  FaKey,
  FaBuilding,
  FaFileContract,
} from "react-icons/fa";
import "./Services.css";

const Services = () => {
  const [services] = useState([
    {
      id: 1,
      icon: <FaHome />,
      title: "Buy a Home",
      description:
        "Find your perfect home with our extensive listings and expert guidance throughout the buying process.",
    },
    {
      id: 2,
      icon: <FaKey />,
      title: "Sell Property",
      description:
        "Get the best value for your property with our professional marketing and negotiation services.",
    },
    {
      id: 3,
      icon: <FaBuilding />,
      title: "Rent Property",
      description:
        "Discover rental properties that suit your needs and budget in prime locations.",
    },
    {
      id: 4,
      icon: <FaChartLine />,
      title: "Property Valuation",
      description:
        "Get accurate market valuations to make informed decisions about buying or selling.",
    },
    {
      id: 5,
      icon: <FaHandshake />,
      title: "Consultation",
      description:
        "Expert real estate advice and personalized consultation for all your property needs.",
    },
    {
      id: 6,
      icon: <FaFileContract />,
      title: "Legal Support",
      description:
        "Complete legal assistance and documentation support for seamless transactions.",
    },
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-scroll functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % services.length);
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, [services.length]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % services.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + services.length) % services.length
    );
  };

  return (
    <section id="services" className="services">
      <div className="services-container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2>Our Services</h2>
          <p>Comprehensive real estate solutions tailored to your needs</p>
        </motion.div>

        <div className="services-slider">
          <button className="slider-btn prev" onClick={prevSlide}>
            &#8249;
          </button>

          <div className="services-wrapper">
            <div
              className="services-track"
              style={{
                transform: `translateX(-${
                  currentIndex * (100 / Math.min(services.length, 4))
                }%)`,
              }}
            >
              {services.map((service) => (
                <motion.div
                  key={service.id}
                  className="service-card"
                  whileHover={{
                    y: -10,
                    boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                    transition: { duration: 0.3 },
                  }}
                >
                  <motion.div
                    className="service-icon"
                    whileHover={{
                      scale: 1.1,
                      rotate: 5,
                      transition: { duration: 0.3 },
                    }}
                  >
                    {service.icon}
                  </motion.div>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  <motion.button
                    className="service-btn"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Learn More
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </div>

          <button className="slider-btn next" onClick={nextSlide}>
            &#8250;
          </button>
        </div>

        <div className="slider-dots">
          {services.map((_, index) => (
            <span
              key={index}
              className={`dot ${index === currentIndex ? "active" : ""}`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
