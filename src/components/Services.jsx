import { useState } from "react";
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

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % services.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + services.length) % services.length
    );
  };

  // Animation for service cards entrance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
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
          <h2>
            Our <span className="highlight">Services</span>
          </h2>
          <p>Comprehensive real estate solutions tailored to your needs</p>
        </motion.div>

        <div className="services-slider">
          <button className="slider-btn prev" onClick={prevSlide}>
            &#8249;
          </button>

          <div className="services-wrapper">
            <motion.div
              className="services-track"
              style={{
                transform: `translateX(-${
                  currentIndex * (100 / Math.min(services.length, 4))
                }%)`,
              }}
            >
              {services.map((service, index) => (
                <motion.div
                  key={service.id}
                  className="service-card"
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover={{
                    y: -15,
                    boxShadow: "0 25px 50px rgba(0,0,0,0.15)",
                    transition: { duration: 0.3 },
                  }}
                >
                  <motion.div
                    className="service-icon"
                    whileHover={{
                      scale: 1.15,
                      rotate: [0, 5, -5, 0],
                      transition: { duration: 0.5 },
                    }}
                    animate={{
                      y: [0, -10, 0],
                      transition: {
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: index * 0.2,
                      },
                    }}
                  >
                    {service.icon}
                  </motion.div>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  <motion.button
                    className="service-btn"
                    whileHover={{
                      scale: 1.05,
                      backgroundColor: "#764ba2",
                    }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    Learn More
                  </motion.button>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <button className="slider-btn next" onClick={nextSlide}>
            &#8250;
          </button>
        </div>

        <div className="slider-dots">
          {services.map((_, index) => (
            <motion.span
              key={index}
              className={`dot ${index === currentIndex ? "active" : ""}`}
              onClick={() => setCurrentIndex(index)}
              whileHover={{ scale: 1.3 }}
              whileTap={{ scale: 0.9 }}
              animate={{
                scale: index === currentIndex ? 1.3 : 1,
                backgroundColor: index === currentIndex ? "#667eea" : "#ccc",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
