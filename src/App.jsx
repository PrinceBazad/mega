import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
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
import AgentDetail from "./components/AgentDetail";
import ProjectDetail from "./components/ProjectDetail";
import "./App.css";

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation();

  return (
    <div className="app">
      <TopBar />
      <Navbar />
      <Routes key={location.pathname}>
        <Route
          path="/"
          element={
            <div className="homepage-route">
              <Hero />
              <Properties />
              <Services />
              <TopBuilders />
              <AgentsSection />
              <About />
              <Projects />
              <Contact />
            </div>
          }
        />
        <Route path="/properties" element={<PropertiesPage />} />
        <Route path="/property/:id" element={<LocationAwarePropertyDetail />} />
        <Route path="/projects" element={<Projects />} />
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
        <Route path="/agent/:id" element={<LocationAwareAgentDetail />} />
        <Route path="/project/:id" element={<LocationAwareProjectDetail />} />
      </Routes>
      <Footer />
    </div>
  );
}

// Wrapper components that force re-render on location change
function LocationAwarePropertyDetail() {
  const location = useLocation();
  return <PropertyDetail key={location.key} />;
}

function LocationAwareAgentDetail() {
  const location = useLocation();
  return <AgentDetail key={location.key} />;
}

function LocationAwareProjectDetail() {
  const location = useLocation();
  return <ProjectDetail key={location.key} />;
}

export default App;
// No Experts component - completely removed
