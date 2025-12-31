import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaHome,
  FaHandshake,
  FaChartLine,
  FaKey,
  FaBuilding,
  FaFileContract,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";
import API_BASE_URL from "../config";
import "./Services.css";
import eventBus, { EVENT_TYPES } from "../utils/eventBus";

const Services = () => {
  const [sectionContent, setSectionContent] = useState({
    title: "Our Services",
    description: "Comprehensive real estate solutions tailored to your needs",
  });

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

  // Fetch section content from admin panel
  useEffect(() => {
    const fetchHomeContent = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/admin/home-content`);
        if (response.ok) {
          const data = await response.json();
          setSectionContent({
            title: data.services?.title || "Our Services",
            description:
              data.services?.description ||
              "Comprehensive real estate solutions tailored to your needs",
          });
        }
      } catch (error) {
        console.error("Error fetching services section content:", error);
      }
    };

    fetchHomeContent();

    // Listen for home content updates
    const handleHomeContentUpdate = (event) => {
      if (event.detail.section === "services") {
        setSectionContent({
          title: event.detail.content.title,
          description: event.detail.content.description,
        });
      }
    };

    const handleHomeContentChanged = (data) => {
      if (data.section === "services") {
        setSectionContent({
          title: data.content.title,
          description: data.content.description,
        });
      }
    };

    window.addEventListener("homeContentUpdated", handleHomeContentUpdate);
    eventBus.on(EVENT_TYPES.HOME_CONTENT_CHANGED, handleHomeContentChanged);

    return () => {
      window.removeEventListener("homeContentUpdated", handleHomeContentUpdate);
      eventBus.off(EVENT_TYPES.HOME_CONTENT_CHANGED, handleHomeContentChanged);
    };
  }, []);

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
          <h2>{sectionContent.title || "Our Services"}</h2>
          <p>
            {sectionContent.description ||
              "Comprehensive real estate solutions tailored to your needs"}
          </p>
        </motion.div>

        <div className="services-grid">
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
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
