import React from 'react';

import ProjectsSection from '../components/ProjectsSection';
import Footer from '../components/Footer';
import './WorkPage.css';

import { allWorkProjects } from '../data/projects';

function WorkPage() {
  return (
    <div className="work-page-container">
      
      <div className="work-page-content mg-t">
        <ProjectsSection
          projects={allWorkProjects}
          showArrow={false}
          headerTitle="PORTFOLIO"
          headerParagraph="FROM COMMERCIAL FRAMES TO PERSONAL STORIES — A VIEW THROUGH MY LENS"
        />
      </div>
      <Footer />
    </div>
  );
}

export default WorkPage;