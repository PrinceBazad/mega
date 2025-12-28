import { useState, useEffect, useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"; // Removed FaPlay, FaPause since we're removing the toggle
import API_BASE_URL from "../config";
import "./AutoScrollSection.css";

const AutoScrollSection = () => {
  const [pages, setPages] = useState([
    {
      backgroundImage:
        "https://images.unsplash.com/photo-1560448204-e02f33c33ddc?w=1920&q=80",
      title: "Premium Properties",
      description:
        "Discover our collection of premium properties in the best locations",
    },
    {
      backgroundImage:
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1920&q=80",
      title: "Luxury Living",
      description:
        "Experience luxury living with our exclusive property collection",
    },
    {
      backgroundImage:
        "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=1920&q=80",
      title: "Modern Designs",
      description: "Modern architectural designs for contemporary living",
    },
    {
      backgroundImage:
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1920&q=80",
      title: "Affordable Options",
      description: "Find affordable options without compromising on quality",
    },
    {
      backgroundImage:
        "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1920&q=80",
      title: "Investment Opportunities",
      description: "Great investment opportunities with high returns",
    },
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true); // Always true now
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef(null);

  // Fetch content from admin panel
  useEffect(() => {
    const fetchHomeContent = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/admin/home-content`);
        if (response.ok) {
          const data = await response.json();
          // First, try to get specific autoscroll content
          if (data.autoscroll && data.autoscroll.pages) {
            setPages(data.autoscroll.pages);
          } else if (data.autoScrollSection && data.autoScrollSection.pages) {
            // Fallback to old structure if needed
            setPages(data.autoScrollSection.pages);
          }
        }
      } catch (error) {
        console.error("Error fetching auto scroll section content:", error);
      }
    };

    fetchHomeContent();

    // Listen for home content updates
    const handleHomeContentUpdate = (event) => {
      if (event.detail.section === "autoscroll") {
        // Update with specific autoscroll content
        setPages(event.detail.content.pages || pages);
      } else if (event.detail.section === "autoScrollSection") {
        // Fallback to old section name
        setPages(event.detail.content.pages || pages);
      }
    };

    window.addEventListener("homeContentUpdated", handleHomeContentUpdate);

    return () => {
      window.removeEventListener("homeContentUpdated", handleHomeContentUpdate);
    };
  }, []);

  // Auto-scroll functionality - always on now
  useEffect(() => {
    if (isAutoScrolling && !isHovered) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % pages.length);
      }, 5000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isAutoScrolling, isHovered, pages.length]);

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % pages.length);
  };

  const goToPrev = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + pages.length) % pages.length
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  // Removed toggleAutoScroll function since it's not needed anymore

  return (
    <section
      className="auto-scroll-section"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="auto-scroll-page"
        style={{
          backgroundImage: pages[currentIndex]?.backgroundImage
            ? `url(${pages[currentIndex]?.backgroundImage})`
            : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="auto-scroll-content">
          <h2>{pages[currentIndex]?.title}</h2>
          <p>{pages[currentIndex]?.description}</p>
        </div>
      </div>

      {/* Navigation controls */}
      <div className="auto-scroll-controls">
        <button
          className="nav-button prev-button"
          onClick={goToPrev}
          aria-label="Previous slide"
        >
          <FaChevronLeft />
        </button>

        <button
          className="nav-button next-button"
          onClick={goToNext}
          aria-label="Next slide"
        >
          <FaChevronRight />
        </button>
      </div>
    </section>
  );
};

export default AutoScrollSection;
