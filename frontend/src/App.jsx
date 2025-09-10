import React from 'react'
import {Routes, Route} from 'react-router-dom'
import Home from './Pages/Home'
import BUnit from './Pages/BUnit'
import CUnit from './Pages/CUnit'
import Courses from './Pages/Courses'
import Results from './Pages/Results'
import Publications from './Pages/Publications'
import Notices from './Pages/Notices'
import More from './Pages/More'
import AdminHome from './Pages/AdminHome'
import AdminSignIn from './Pages/AdminSignIn'
import AdminRegister from './Pages/AdminRegister'
import Admission from './Pages/Admission'
import StudentLogin from './Pages/StudentLogin'
import ForgotPassword from './Pages/ForgotPassword'
import StudentProfile from './Pages/StudentProfile'
import StudentList from './Pages/StudentList'
import EditStudent from './Pages/EditStudent'
import DeleteStudent from './Pages/DeleteStudent'
import GalleryManagement from './Pages/GalleryManagement'
import About from './Pages/About'

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Home/>} /> 
      <Route path="/BUnit" element={<BUnit />} />
      <Route path="/CUnit" element={<CUnit />} />
      <Route path="/Courses" element={<Courses />} />
      <Route path="/Results" element={<Results />} />
      <Route path="/Publications" element={<Publications />} />
      <Route path="/Notices" element={<Notices />} />
      <Route path="/More" element={<More />} />
      <Route path="/AdminHome" element={<AdminHome />} />
      <Route path="/AdminSignIn" element={<AdminSignIn />} />
      <Route path="/AdminRegister" element={<AdminRegister />} />
      <Route path="/Admission" element={<Admission />} />
      <Route path="/StudentLogin" element={<StudentLogin />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/StudentProfile" element={<StudentProfile />} />
      <Route path="/StudentProfile/:id" element={<StudentProfile />} />
      <Route path="/StudentList" element={<StudentList />} />
      <Route path="/students/edit/:id" element={<EditStudent />} />
      <Route path="/students/delete/:id" element={<DeleteStudent />} />
      <Route path="/GalleryManagement" element={<GalleryManagement />} />
      <Route path="/about" element={<About />} />
      {/* Add more routes as needed */}
    </Routes>
  )
}

export default App
