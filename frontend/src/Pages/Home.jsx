import React from 'react';
import Navbar from '../Components/Navbar.jsx'
import Hero from '../Components/Hero.jsx'
import Footer from '../Components/Footer.jsx'
import AboutSection from '../Components/AboutSection.jsx'
import CoursesSection from '../Components/CoursesSection.jsx'
import SuccessSection from '../Components/SuccessSection.jsx'
import FeaturesSection from '../Components/FeaturesSection.jsx'
import GallerySection from '../Components/GallerySection.jsx'
import SuccessStoriesSection from '../Components/SuccessStoriesSection.jsx'
import UniversitiesSection from '../Components/UniversitiesSection.jsx'

const Home = () => {
  return (
    <div className='bg-blue-50 min-h-screen'>
      <Navbar />
      <div className='w-full overflow-x-hidden'>
        <Hero />
        <div className='space-y-8 sm:space-y-12 lg:space-y-16'>
          <AboutSection />
          <CoursesSection />
          <FeaturesSection />
          <GallerySection />
          <SuccessStoriesSection />
          <SuccessSection />
          <UniversitiesSection />
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Home
