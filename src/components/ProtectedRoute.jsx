import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if admin is authenticated
    const checkAuth = () => {
      const token = localStorage.getItem("adminToken");
      const admin = localStorage.getItem("admin");

      console.log("Checking auth - Token:", token, "Admin:", admin);

      if (!token || !admin) {
        console.log("No token or admin info, redirecting to login");
        // Redirect to login if not authenticated
        navigate("/admin/login");
      } else {
        // Token exists, check if it's still valid
        try {
          const parsedAdmin = JSON.parse(admin);
          console.log("Admin parsed:", parsedAdmin);
          if (parsedAdmin && parsedAdmin.id) {
            console.log("Authentication verified, showing protected content");
            setIsLoading(false);
          } else {
            console.log("Invalid admin info, redirecting to login");
            navigate("/admin/login");
          }
        } catch (error) {
          console.log("Error parsing admin info, redirecting to login", error);
          navigate("/admin/login");
        }
      }
    };

    checkAuth();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="spinner"></div>
          <p>Verifying authentication...</p>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
