import React, {useState, useEffect, useContext} from 'react'
// import { dummyStudentEnrolled } from '../../assets/assets'
import Loading from '../../components/students/Loading'
import { AppContext } from '../../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom'
export const AllCourses = () => {
  const { currency, backendUrl, isEducator, getToken } = useContext(AppContext);
  const [courses, setCourses] = useState(null);

  

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this course?"
    );
    if (!confirmed) {
      return;
    }

    try {
      await axios.delete(`${backendUrl}/api/educator/${id}`); // Replace with your API URL
      // Update the courses state to remove the deleted course
      setCourses(courses.filter((course) => course._id !== id));
      alert("Course deleted successfully");
    } catch (err) {
      console.error(err);
      alert("Error deleting course");
    }
  };

  useEffect(() => {
    const fatchAllCourses = async () => {
      try {
        // const token = await getToken();
        // console.log(token);
  
        // const {data}  = await axios.get(backendUrl + "/api/admin/all-courses");
  
        const {data} = await axios.get('http://localhost:5000/api/admin/all-courses')
        
  
        data.success && setCourses(data.courses);
        console.log(courses + data.success)
      } catch (error) {
        toast.error('here'+ error.message);
      }
    };
    // if (isEducator) {
      fatchAllCourses();
    // }
  }, []);

  return courses ? (
    <div className="h-screen flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0">
      <div className="w-full">
        <h1 className="pb-4 text-lg font-medium">My courses</h1>
        <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
          <table className="md:table-auto table-fixed w-full overflow-hidden">
            <thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left ">
              <tr>
                <th className="px-4 py-3 font-semibold truncate">
                  All Courses
                </th>
                <th className="px-4 py-3 font-semibold truncate">Earnings</th>
                <th className="px-4 py-3 font-semibold truncate">Students</th>
                <th className="px-4 py-3 font-semibold truncate">Published</th>
                <th>Delete</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-500">
              {courses.map((course) => (
                <tr key={course._id} className="border border-gray-500/20">
                  <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate">
                    <img
                      src={course.courseThumbnail}
                      alt="course image"
                      className="w-16"
                    />
                    <span className="truncate hidden md:block">
                      {course.courseTitle}
                    </span>
                  </td>
                  <td className="px-4 py-3 ">
                    {currency}{" "}
                    {Math.floor(
                      course.enrolledStudents.length *
                        (course.coursePrice -
                          (course.discount * course.coursePrice) / 100)
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {" "}
                    {course.enrolledStudents.length}
                  </td>
                  <td className="px-4 py-3">
                    {new Date(course.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <button onClick={() => handleDelete(course._id)}>
                      <img
                        className="w-7 h-7"
                        src={assets.delete_icon}
                        alt=""
                      />
                    </button>

                    {/* {course._id} */}
                  </td>
                  <td>
                    <Link
                      to={"/educator/modify-course/" + course._id}
                      onClick={() => scrollTo(0, 0)}
                      className="border border-gray-500/30 pb-6 overflow-hidden rounded-lg"
                    >
                      <img className="w-7 h-7" src={assets.edit_icon} alt="" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default AllCourses;
