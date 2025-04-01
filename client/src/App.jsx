import React from "react";
import { Routes, Route, useMatch } from "react-router-dom";
import Home from "./pages/student/Home";
import CoursesList from "./pages/student/CoursesList";
import CourseDetails from "./pages/student/CourseDetails";
import MyEnrollments from "./pages/student/MyEnrollments";
import Player from "./pages/student/Player";
import Loading from "./components/students/Loading";
import Educator from "./pages/educator/Educator";
import Dashboard from "./pages/educator/Dashboard";
import AddCourse from "./pages/educator/AddCourse";
import MyCourses from "./pages/educator/MyCourses";
import StudentsEnrolled from "./pages/educator/StudentsEnrolled";
import Navbar from "./components/students/Navbar";
import "quill/dist/quill.snow.css"
import {ToastContainer} from 'react-toastify'
import ModifyCourse from "./pages/educator/ModifyCourse";
import Admin from "./pages/admin/Admin";
import { AllCourses } from "./pages/admin/AllCourses";
import AllUsers from "./pages/admin/AllUsers";
import Dasboard from "./pages/admin/AdminDasboard";
import AdminDasboard from "./pages/admin/AdminDasboard";
const App = () => {
  
  const isEducatorRoute =  useMatch('/educator/*')

  return (
    <div className="text-default min-h-screen bg-white">
      <ToastContainer />
      {!isEducatorRoute && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/course-list" element={<CoursesList />} />
        <Route path="/course-list/:input" element={<CoursesList />} />

        <Route path="/course/:id" element={<CourseDetails />} />
        <Route path="/my-enrollments" element={<MyEnrollments />} />
        <Route path="/player/:courseId" element={<Player />} />
        <Route path="/loading" element={<Loading />} />

        <Route path="/educator" element={<Educator />}>
          <Route path="/educator" element={<Dashboard />} />
          <Route path="add-course" element={<AddCourse />} />
          <Route path="my-courses" element={<MyCourses />} />
          <Route path="students-enrolled" element={<StudentsEnrolled />} />
          <Route path="modify-course/:id" element={<ModifyCourse />} />
        </Route>

        <Route path="/admin" element={<Admin />}>
          <Route path="/admin" element={<AdminDasboard />} />
          {/* <Route path="add-course" element={<AddCourse />} /> */}
          <Route path="all-courses" element={<AllCourses />} />
          <Route path="all-users" element={<AllUsers />} />
          {/* <Route path="modify-course/:id" element={<Dasboard />} /> */}
        </Route>

      </Routes>
    </div>
  );
};

export default App;
