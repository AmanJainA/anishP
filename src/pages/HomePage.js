import React, { useEffect, useState } from 'react';
import TitlePage from '../components/TitlePage';
import ProjectsSection from '../components/ProjectsSection';
import TextRevealSection from '../components/TextRevealSection';
import Footer from '../components/Footer';
import { getProjects } from '../data/projects';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

function HomePage() {
  const [projects, setProjects] = useState([]);
  useEffect(() => { getProjects().then(rows => setProjects(rows.slice(0, 11))).catch(console.error); }, []);
  return (<>
    <TitlePage />
    <ProjectsSection projects={projects} />
    <div style={{ background:'#0e1111', textAlign:'center', paddingBottom:'40px' }}>
      <Link to="/portfolio" style={{ textDecoration:'none' }}>
        <motion.div style={{ display:'inline-block', padding:'15px 30px', border:'1px solid #F0EFEA', color:'#F0EFEA', fontFamily:'CustomFont, sans-serif', fontSize:'1.2em', textTransform:'uppercase', cursor:'pointer' }} whileHover={{ backgroundColor:'#F0EFEA', color:'#0e1111' }}>View All</motion.div>
      </Link>
    </div>
    <TextRevealSection text="My job isn’t to make things look good. It’s to make them mean something. A well-lit frame is useless if it doesn’t move you. The right story, told honestly, hits harder than perfection ever could." blackFont={true}/>
    <Footer />
  </>);
}
export default HomePage;
