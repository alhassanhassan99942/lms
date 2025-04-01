import User from "../models/User.js";
import Course from "../models/Course.js";
import { Purchase } from "../models/Purchase.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    console.log(users);
    res.json({ success: true, users });
  }catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({});
    console.log(courses);
    res.json({ success: true, courses });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};



export const adminDashboardData = async (req, res) => {
  try {
    const educator = req.auth.userId;
    const courses = await Course.find({ });
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

    const enrolledUsersData = [];
    for (const course of courses) {
      const users = await User.find(
        {},
        "name imageUrl"
      );

      users.forEach((user) => {
        enrolledUsersData.push({
          courseTitle: course.courseTitle,
          user,
        });
      });
    }
    res.json({
      success: true,
      dashboardData: {
        totalEarnings,
        enrolledUsersData,
        totalCourses,
      },
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};