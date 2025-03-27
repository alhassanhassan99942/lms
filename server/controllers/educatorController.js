import { clerkClient } from "@clerk/express";
import { v2 as cloudinary } from "cloudinary";
import Course from "../models/Course.js";
import { Purchase } from "../models/Purchase.js";
import User from "../models/User.js";

export const updateRoleToEducator = async (req, res) => {
  try {
    const userId = req.auth.userId;
    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        role: "educator",
      },
    });
    res.json({ sucess: true, message: "You Can Publlish a course now" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};



// Get Educator courses

export const getEducatorCourses = async (req, res) => {
  try {
    const educator = req.auth.userId;

    const courses = await Course.find({ educator });
    res.json({ success: true, courses });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const educatorDashboardData = async (req, res) => {
  try {
    const educator = req.auth.userId;
    const courses = await Course.find({ educator });
    const totalCourses = courses.length;

    const courseIds = courses.map((course) => course._id);

    // calculate total Earning
    const purchases = await Purchase.find({
      courseId: { $in: courseIds },
      status: "completed",
    });

    const totalEarnings = purchases.reduce(
      (sum, purchase) => sum + purchase.amount,
      0
    );

    // collect unique enrolled student IDs with their course titles

    const enrolledStudentsData = [];
    for (const course of courses) {
      const students = await User.find(
        {
          _id: { $in: course.enrolledStudents },
        },
        "name imageUrl"
      );

      students.forEach((student) => {
        enrolledStudentsData.push({
          courseTitle: course.courseTitle,
          student,
        });
      });
    }
    res.json({
      success: true,
      dashboardData: {
        totalEarnings,
        enrolledStudentsData,
        totalCourses,
      },
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getEnrolledStudentsData = async (req, res) => {
  try {
    const educator = req.auth.userId;
    const courses = await Course.find({ educator });
    const courseIds = courses.map((course) => course._id);
    const purchases = await Purchase.find({
      courseId: { $in: courseIds },
      status: "completed",
    })
      .populate("userId", "name imageUrl")
      .populate("courseId", "courseTitle");
    const enrolledStudents = purchases.map((purchase) => ({
      student: purchase.userId,
      courseTitle: purchase.courseId.courseTitle,
      purchaseDate: purchase.createdAt,
    }));
    res.json({ success: true, enrolledStudents });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export const modifyCourse =  async (req, res) => {
  try {
      // const courseData = JSON.parse(req.body.courseData);
    const { courseData } = req.body;

      // const { title, description, price, discount, courseContent } = courseData;
      const parsedCourseData = await JSON.parse(courseData);

      //check if course exists
      const existingCourse = await Course.findById(req.params.id);
      if(!existingCourse){
           return res.status(404).json({ success: false, message: 'Course not found' });
      }

      let thumbnail = existingCourse.thumbnail; //default to the existing thumbnail
      if (req.file) {
          thumbnail = req.file.path; //if new image, update thumbnail path
      }

      const updatedCourse = await Course.findByIdAndUpdate(
          req.params.id,
          // {
          //     title,
          //     description,
          //     price: Number(price),
          //     discount: Number(discount),
          //     thumbnail,
          //     courseContent,
          //     updatedAt: Date.now(),
          // },
          parsedCourseData,
          { new: true, runValidators: true }
      );

      if (!updatedCourse) {
          return res.status(404).json({ success: false, message: 'Course not found' });
      }

      res.status(200).json({ success: true, message: 'Course updated successfully', course: updatedCourse });
  } catch (error) {
      res.json({ success: false, message: error.message });
  }
}

export const addCourse = async (req, res) => {
  try {
    const { courseData } = req.body;
    const imageFile = req.file;
    const educatorId = req.auth.userId;

    if (!imageFile) {
      return res.json({ success: false, message: "Thumbnail not Attached" });
    }
    const parsedCourseData = await JSON.parse(courseData);
    parsedCourseData.educator = educatorId;
    const newCourse = await Course.create(parsedCourseData);
    const imageUpload = await cloudinary.uploader.upload(imageFile.path);
    newCourse.courseThumbnail = imageUpload.secure_url;
    await newCourse.save();

    res.json({ success: true, message: "Course Created" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};