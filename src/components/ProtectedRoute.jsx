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

      if (!token || !admin) {
        // Redirect to login if not authenticated
        navigate("/admin/login");
      } else {
        // Token exists, check if it's still valid (in a real app, you might want to verify with backend)
        try {
          const parsedAdmin = JSON.parse(admin);
          if (parsedAdmin && parsedAdmin.id) {
            setIsLoading(false);
          } else {
            navigate("/admin/login");
          }
        } catch (error) {
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
