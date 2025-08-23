import React from 'react';
import { MdLocationPin } from "react-icons/md";
import { FaPhoneAlt, FaEnvelope, FaGlobe } from "react-icons/fa";
import { FaFacebookSquare } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaYoutube } from 'react-icons/fa';
import  Copyright  from '../Components/Copyright';



const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white pt-8 sm:pt-12 pb-4 flex flex-col">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 flex-grow">
        <div className="lg:col-span-1">
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 border-b border-blue-600 pb-2">Get in Touch</h3>
          <div className="flex flex-col items-start gap-y-2 sm:gap-y-3 text-xs sm:text-sm">
            <span className="flex items-start gap-2"><MdLocationPin className='text-lg sm:text-xl text-red-600 flex-shrink-0 mt-0.5'/>
              <span className="leading-relaxed">Notun Bazar Moor, Mymensingh, Bangladesh, 2200</span>
            </span>
            <span className="flex items-center gap-2"><FaPhoneAlt className='text-sm sm:text-base text-blue-600 flex-shrink-0'/>
              <a href="tel:+8801917853289" className="hover:text-blue-400 transition-colors">+88 01917853289</a>
            </span>
            <span className="flex items-center gap-2"><FaEnvelope className='text-sm sm:text-base text-white flex-shrink-0'/>
              <a href="mailto:paragonmymen@gmail.com" className="hover:text-blue-400 transition-colors break-all">paragonmymen@gmail.com</a>
            </span>
            <span className="flex items-center gap-2"><FaGlobe className='text-sm sm:text-base text-white flex-shrink-0'/>
              <span>paragonacademy.com</span>
            </span>
          </div>
        </div>
        <div className="lg:col-span-1">
          <h3 className="text-base sm:text-lg font-semibold mt-6 sm:mt-8 lg:mt-0 mb-3 sm:mb-4 border-b border-blue-600 pb-2">Useful Links</h3>
          <ul className="text-xs sm:text-sm space-y-2 sm:space-y-3">
            <li><a href="#" className="hover:underline hover:text-blue-400 transition-colors">Admission</a></li>
            <li><a href="#" className="hover:underline hover:text-blue-400 transition-colors">About</a></li>
            <li><a href="#" className="hover:underline hover:text-blue-400 transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:underline hover:text-blue-400 transition-colors">Terms & Conditions</a></li>
            <li><a href="#" className="hover:underline hover:text-blue-400 transition-colors">Courses</a></li>
          </ul>
        </div>
        <div className="sm:col-span-2 lg:col-span-1">
          <h3 className="text-base sm:text-lg font-semibold mt-6 sm:mt-8 lg:mt-0 mb-3 sm:mb-4 border-b border-blue-600 pb-2">Subscribe Us</h3>
          <form className="flex flex-col space-y-2 sm:space-y-3 mb-4 sm:mb-6">
            <input 
              type="email" 
              placeholder="Your Email" 
              className="px-3 py-2 sm:py-2.5 rounded text-gray-800 border-2 border-gray-400 focus:border-blue-500 focus:outline-none transition-colors text-sm sm:text-base" 
            />
            <button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2 sm:py-2.5 text-sm sm:text-base font-medium transition-colors duration-200 hover:scale-105 transform"
            >
              Subscribe
            </button>
          </form>
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 border-b border-blue-600 pb-2">Connect With Us</h3>
          <ul className="flex space-x-4 sm:space-x-6 text-xl sm:text-2xl">
            <li>
              <a 
                href="https://www.facebook.com/paragonmymensingh1?_rdc=1&_rdr#" 
                className="hover:text-blue-400 text-blue-600 transition-colors duration-200 hover:scale-110 transform inline-block"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaFacebookSquare />
              </a>
            </li>
            <li>
              <a 
                href="https://www.instagram.com/paragonmymensingh?igsh=dG8zdGZxcnMzZzQ0" 
                className="hover:text-pink-400 text-purple-500 transition-colors duration-200 hover:scale-110 transform inline-block"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram />
              </a>
            </li>
            <li>
              <a 
                href="https://www.youtube.com/@paragonadmissioncoaching3846" 
                className="hover:text-red-400 text-red-600 transition-colors duration-200 hover:scale-110 transform inline-block"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaYoutube />
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="mt-6 sm:mt-8">
        <Copyright />
      </div>
    </footer>
  );
}

export default Footer;