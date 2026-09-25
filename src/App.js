import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import './App.css';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import WorkPage from './pages/WorkPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import WritingPage from './pages/WritingPage';
import Navbar from './components/Navbar';

const pageVariants = {
  initial: {
    opacity: 0,
    backgroundColor: "#0e1111" // Set initial background color
  },
  animate: {
    opacity: 1,
    backgroundColor: "transparent", // Animate to transparent
    transition: {
      duration: 0.8, // Slower fade
      ease: "easeInOut"
    }
  },
  exit: {
    opacity: 0,
    backgroundColor: "#0e1111", // Set exit background color
    transition: {
      duration: 0.8, // Slower fade
      ease: "easeInOut"
    }
  }
};

function App() {
  const location = useLocation();
  const isDarkNavbar = location.pathname === '/about' || location.pathname.startsWith('/portofolio/') || location.pathname === '/writings';

  return (
    <div className="App">
      <Navbar isDark={isDarkNavbar} />
      <AnimatePresence mode='wait'>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={
            <motion.div
              key="home"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <HomePage />
            </motion.div>
          } />
          <Route path="/about" element={
            <motion.div
              key="about"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <AboutPage />
            </motion.div>
          } />
          <Route path="/portfolio" element={
            <motion.div
              key="portfolio"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <WorkPage />
            </motion.div>
          } />
          <Route path="/portofolio" element={
            <motion.div
              key="project-detail-empty"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <ProjectDetailPage />
            </motion.div>
          } />
          <Route path="/portofolio/:slug" element={
            <motion.div
              key="project-detail"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <ProjectDetailPage />
            </motion.div>
          } />
          <Route path="/writings" element={
            <motion.div
              key="writings"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <WritingPage />
            </motion.div>
          } />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

function AppWrapper() {
  return (
    <App />
  );
}

export default AppWrapper;