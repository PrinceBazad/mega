import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Loading from "./components/Loading";
import Navbar from "./components/Navbar";
import LocationSelector from "./components/LocationSelector";
import Hero from "./components/Hero";
import Properties from "./components/Properties";
import PropertiesPage from "./components/PropertiesPage";
import PropertyDetail from "./components/PropertyDetail";
import Services from "./components/Services";
import About from "./components/About";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    setTimeout(() => {
      setLoading(false);
    }, 2500);
  }, []);

  return (
    <Router>
      <AnimatePresence>{loading && <Loading />}</AnimatePresence>

      {!loading && (
        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={
              <div className="app">
                <LocationSelector />
                <Navbar />
                <Hero />
                <Properties />
                <Services />
                <About />
                <Contact />
                <Footer />
              </div>
            }
          />

          <Route
            path="/properties"
            element={
              <div className="app">
                <LocationSelector />
                <Navbar />
                <PropertiesPage />
                <Footer />
              </div>
            }
          />

          <Route
            path="/property/:id"
            element={
              <div className="app">
                <LocationSelector />
                <Navbar />
                <PropertyDetail />
                <Footer />
              </div>
            }
          />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard/*"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </Router>
  );
}

export default App;
