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

  // Check if we're on an admin page
  const isAdminPage = location.pathname.startsWith("/admin");

  // Force full re-render when leaving homepage
  const [renderKey, setRenderKey] = React.useState(0);

  React.useEffect(() => {
    // Reset the render key when navigating to ensure re-render
    setRenderKey((prev) => prev + 1);
  }, [location.pathname]);

  return (
    <div className="app" key={renderKey}>
      {!isAdminPage && <TopBar />}
      {!isAdminPage && <Navbar />}
      <Routes>
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
        <Route path="/property/:id" element={<PropertyDetail />} />
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
        <Route path="/agent/:id" element={<AgentDetail />} />
        <Route path="/project/:id" element={<ProjectDetail />} />
      </Routes>
      {!isAdminPage && <Footer />}
    </div>
  );
}

export default App;
// No Experts component - completely removed
