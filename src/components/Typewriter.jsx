import { useState, useEffect } from "react";
import API_BASE_URL from "../config";
import "./Typewriter.css";

const Typewriter = () => {
  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [textIndex, setTextIndex] = useState(0);
  const [messages, setMessages] = useState([
    "Find Your Dream Property",
    "Discover the perfect place to call home",
  ]);

  // Fetch messages from admin panel
  useEffect(() => {
    const fetchHeroContent = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/admin/home-content`);
        if (response.ok) {
          const data = await response.json();
          if (data.hero && data.hero.title) {
            setMessages([
              data.hero.title,
              data.hero.subtitle || "Discover the perfect place to call home",
            ]);
          }
        }
      } catch (error) {
        console.error("Error fetching hero content:", error);
      }
    };

    fetchHeroContent();

    // Listen for home content updates
    const handleHomeContentUpdate = (event) => {
      if (event.detail.section === "hero") {
        setMessages([
          event.detail.content.title || "Find Your Dream Property",
          event.detail.content.subtitle ||
            "Discover the perfect place to call home",
        ]);
      }
    };

    window.addEventListener("homeContentUpdated", handleHomeContentUpdate);

    return () => {
      window.removeEventListener("homeContentUpdated", handleHomeContentUpdate);
    };
  }, []);

  useEffect(() => {
    if (messages.length === 0) return;

    const currentMessage = messages[textIndex];
    const typingSpeed = isDeleting ? 50 : 100;
    const pauseAfterDeleting = 500;

    const timer = setTimeout(
      () => {
        if (!isDeleting && currentIndex < currentMessage.length) {
          setCurrentText(currentMessage.substring(0, currentIndex + 1));
          setCurrentIndex(currentIndex + 1);
        } else if (isDeleting && currentIndex > 0) {
          setCurrentText(currentMessage.substring(0, currentIndex - 1));
          setCurrentIndex(currentIndex - 1);
        } else if (!isDeleting && currentIndex === currentMessage.length) {
          setTimeout(() => setIsDeleting(true), 1000); // Pause before deleting
        } else if (isDeleting && currentIndex === 0) {
          setIsDeleting(false);
          setTextIndex((textIndex + 1) % messages.length); // Move to next message
        }
      },
      isDeleting ? pauseAfterDeleting : typingSpeed
    );

    return () => clearTimeout(timer);
  }, [currentText, currentIndex, isDeleting, textIndex, messages]);

  return (
    <span className="typewriter-text">
      {currentText}
      <span className="typewriter-cursor">|</span>
    </span>
  );
};

export default Typewriter;
