import React, { useRef, useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import uniqid from "uniqid";
import Quill from "quill";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

const ModifyCourse = () => {
  const { backendUrl, getToken } = useContext(AppContext);
  const { courseId } = useParams();

  const quillRef = useRef(null);
  const editorRef = useRef(null);

  const [courseTitle, setCourseTitle] = useState("");
  const [coursePrice, setCoursePrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [image, setImage] = useState(null);
  const [chapters, setChapters] = useState([]);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const token = await getToken();
        const { data } = await axios.get(`${backendUrl}/api/educator/course/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (data.success) {
          setCourseTitle(data.course.courseTitle);
          setCoursePrice(data.course.coursePrice);
          setDiscount(data.course.discount);
          setChapters(data.course.courseContent);
          if (quillRef.current) {
            quillRef.current.root.innerHTML = data.course.courseDescription;
          }
        }
      } catch (error) {
        toast.error("Failed to fetch course data");
      }
    };
    fetchCourse();
  }, [courseId, backendUrl, getToken]);

  const handleChapter = (action, chapterId) => {
    if (action === "add") {
      const title = prompt("Enter Chapter Name: ");
      if (title) {
        const newChapter = {
          chapterId: uniqid(),
          chapterTitle: title,
          chapterContent: [],
          collapsed: false,
          chapterOrder: chapters.length > 0 ? chapters.slice(-1)[0].chapterOrder + 1 : 1,
        };
        setChapters([...chapters, newChapter]);
      }
    } else if (action === "remove") {
      setChapters(chapters.filter((chapter) => chapter.chapterId !== chapterId));
    } else if (action === "toggle") {
      setChapters(chapters.map((chapter) =>
        chapter.chapterId === chapterId ? { ...chapter, collapsed: !chapter.collapsed } : chapter
      ));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const courseData = {
        courseTitle,
        courseDescription: quillRef.current.root.innerHTML,
        coursePrice: Number(coursePrice),
        discount: Number(discount),
        courseContent: chapters,
      };
      const formData = new FormData();
      formData.append("courseData", JSON.stringify(courseData));
      if (image) formData.append("image", image);

      const token = await getToken();
      const { data } = await axios.put(`${backendUrl}/api/educator/update-course/${courseId}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        toast.success("Course updated successfully");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
      });
    }
  }, []);

  return (
    <div className="h-screen overflow-scroll flex flex-col items-start justify-between p-4 pt-8">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md w-full text-gray-500">
        <div className="flex flex-col gap-1">
          <p>Course Title</p>
          <input
            onChange={(e) => setCourseTitle(e.target.value)}
            value={courseTitle}
            className="outline-none py-2 px-3 rounded border border-gray-500"
            required
          />
        </div>
        <div className="flex flex-col gap-1">
          <p>Course Description</p>
          <div ref={editorRef}></div>
        </div>
        <div className="flex flex-col gap-1">
          <p>Course Price</p>
          <input
            onChange={(e) => setCoursePrice(e.target.value)}
            value={coursePrice}
            type="number"
            className="outline-none py-2 px-3 rounded border border-gray-500"
            required
          />
        </div>
        <div className="flex flex-col gap-1">
          <p>Discount %</p>
          <input
            type="number"
            onChange={(e) => setDiscount(e.target.value)}
            value={discount}
            className="outline-none py-2 px-3 rounded border border-gray-500"
            required
          />
        </div>
        <button type="button" className="bg-gray-500 text-white w-max py-2 px-4 rounded" onClick={() => handleChapter("add")}>
          + Add Chapter
        </button>
        <button type="submit" className="bg-black text-white w-max py-2.5 px-8 rounded my-4">
          Update Course
        </button>
      </form>
    </div>
  );
};

export default ModifyCourse;
