import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "./components/Navbar";
import TopBar from "./components/TopBar";
import Hero from "./components/Hero";
import Properties from "./components/Properties";
import PropertiesPage from "./components/PropertiesPage";
import PropertyDetail from "./components/PropertyDetail";
import Services from "./components/Services";
import About from "./components/About";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Agents from "./components/Agents";
import TopBuilders from "./components/TopBuilders";
import AgentsSection from "./components/AgentsSection";
import Loading from "./components/Loading";
import "./App.css";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    setTimeout(() => {
      setLoading(false);
    }, 2500);
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <Router>
      <div className="app">
        <TopBar />
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Hero />
                <Properties />
                <Services />
                <TopBuilders />
                <AgentsSection />
                <About />
                <Projects />
                <Contact />
              </>
            }
          />
          <Route path="/properties" element={<PropertiesPage />} />
          <Route path="/property/:id" element={<PropertyDetail />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/agents" element={<Agents />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
// No Experts component - completely removed