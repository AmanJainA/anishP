import React, { useEffect, useState } from 'react';
import ProjectsSection from '../components/ProjectsSection';
import Footer from '../components/Footer';
import './WorkPage.css';
import { getProjects } from '../data/projects';

function WorkPage() {
  const [projects, setProjects] = useState([]);
  useEffect(() => { getProjects().then(setProjects).catch(console.error); }, []);
  return (<div className="work-page-container">
    <div className="work-page-content mg-t"><ProjectsSection projects={projects} showArrow={false} headerTitle="PORTFOLIO" headerParagraph="FROM COMMERCIAL FRAMES TO PERSONAL STORIES — A VIEW THROUGH MY LENS" /></div>
    <Footer />
  </div>);
}
export default WorkPage;
