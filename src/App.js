import React, { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import './App.css';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import WorkPage from './pages/WorkPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import WritingPage from './pages/WritingPage';
import Navbar from './components/Navbar';
import AdminPage from './pages/AdminPage';
import { SUPABASE_URL, SUPABASE_KEY } from './lib/supabase';

const pageVariants = {
  initial:{opacity:0,backgroundColor:'#0e1111'},
  animate:{opacity:1,backgroundColor:'transparent',transition:{duration:.8,ease:'easeInOut'}},
  exit:{opacity:0,backgroundColor:'#0e1111',transition:{duration:.8,ease:'easeInOut'}}
};

function App() {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');
  const isDarkNavbar = location.pathname === '/about' || location.pathname.startsWith('/portofolio/') || location.pathname === '/writings';

  useEffect(() => {
    if (isAdminPath) return;
    const sendVisit = (extra={}) => fetch(`${SUPABASE_URL}/functions/v1/track-visit`, {
      method:'POST',
      headers:{ apikey:SUPABASE_KEY, 'Content-Type':'application/json' },
      body:JSON.stringify({ path:window.location.pathname, ...extra }),
      keepalive:true
    }).catch(() => {});
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        p => sendVisit({lat:p.coords.latitude, lon:p.coords.longitude}),
        () => sendVisit(),
        { enableHighAccuracy:false, timeout:4000, maximumAge:300000 }
      );
    } else sendVisit();
  }, [location.pathname, isAdminPath]);

  if (isAdminPath) return <AdminPage />;

  return <div className="App">
    <Navbar isDark={isDarkNavbar} />
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/admin/*" element={<AdminPage />} />
        <Route path="/" element={<motion.div key="home" variants={pageVariants} initial="initial" animate="animate" exit="exit"><HomePage /></motion.div>} />
        <Route path="/about" element={<motion.div key="about" variants={pageVariants} initial="initial" animate="animate" exit="exit"><AboutPage /></motion.div>} />
        <Route path="/portfolio" element={<motion.div key="portfolio" variants={pageVariants} initial="initial" animate="animate" exit="exit"><WorkPage /></motion.div>} />
        <Route path="/portofolio" element={<motion.div key="project-detail-empty" variants={pageVariants} initial="initial" animate="animate" exit="exit"><ProjectDetailPage /></motion.div>} />
        <Route path="/portofolio/:slug" element={<motion.div key="project-detail" variants={pageVariants} initial="initial" animate="animate" exit="exit"><ProjectDetailPage /></motion.div>} />
        <Route path="/writings" element={<motion.div key="writings" variants={pageVariants} initial="initial" animate="animate" exit="exit"><WritingPage /></motion.div>} />
      </Routes>
    </AnimatePresence>
  </div>;
}
export default App;
