import User from "../models/User.js";
import Stripe from "stripe";
import { Purchase } from "../models/Purchase.js";
import Course from "../models/Course.js";
import { CourseProgress } from "../models/courseProgress.js";
// import normalizePath from 'normalize-path'

// Get user Data
export const getUserData = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    res.json({ success: true, user });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// User Enrolled courses with lecture Link
export const userEnrolledCourses = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const userData = await User.findById(userId).populate("enrolledCourses");

    res.json({ success: true, enrolledCourses: userData.enrolledCourses });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// purchase course
export const purchaseCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const { origin } = req.headers;
    const userId = req.auth.userId;
    const userData = await User.findById(userId);
    const courseData = await Course.findById(courseId);

    if (!userData || !courseData) {
      return res.json({ success: false, message: "Course or User not found" });
    }
    const purchaseData = {
      courseId: courseData._id,
      userId,
      amount: (
        courseData.coursePrice -
        (courseData.discount * courseData.coursePrice) / 100
      ).toFixed(2),
    };

    const newPurchase = await Purchase.create(purchaseData);

    // stripe getway initialized
    const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
    const currency = process.env.CURRENCY.toLowerCase();

    // crating line item for stripe
    const line_item = [
      {
        price_data: {
          currency,
          product_data: {
            name: courseData.courseTitle,
          },
          unit_amount: Math.floor(newPurchase.amount) * 100,
        },
        quantity: 1,
      },
    ];

    const session = await stripeInstance.checkout.sessions.create({
      success_url: `${origin}/my-enrollments`,
      cancel_url: `${origin}/`,
      line_items: line_item,
      mode: "payment",
      metadata: {
        purchaseId: newPurchase._id.toString(),
      },
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Update user course progress
export const userCourseProgress = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const { courseId, lectureId } = req.body;
    const progressData = await CourseProgress.findOne({ userId, courseId });

    if (progressData) {
      if (condition) {
        if (progressData.lectureCompleted.includes(lectureId)) {
          return res.json({
            success: true,
            message: "Lecture Already Completed",
          });
        }
      }
      progressData.lectureCompleted.push(lectureId);
      await progressData.save();
    } else {
      await CourseProgress.create({
        userId,
        courseId,
        lectureCompleted: [lectureId],
      });
    }
    res.json({ success: true, message: "progess Updated" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// get User Course progress
export const getUserCourseProgress = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const { courseId } = req.body;
    const progressData = await CourseProgress.findOne({ userId, courseId });

    res.json({ success: true, progressData });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Add user Rating to course 

export const addUserRating = async (req, res) => {
    const userId = req.auth.userId
    const { courseId, rating } = req.body

    if(!courseId ||  !userId || !rating || rating < 1 || rating > 5 ){
        return res.json({ success: false, message: "Invalid Details" })
    }

    try {
        const course = await Course.findById(courseId)

        if(!course){
        return res.json({ success: false, message: "Course not found " })

        }

        const user = await User.findById(userId)

        if(!user || user.enrolledCourses.includes(courseId)){
            return res.json({ success: false, message: "User has not purchased this course" })
        }

        const existingRatingIndex = course.courseRating.findIndex(r => r.userId === userId)

        if(existingRatingIndex > -1){
            courseRating[existingRatingIndex].rating = rating
        } else{
            course.courseRating.push({userId, rating})
        }
        await course.save()

        return res.json({success: true,message:error.message})

    } catch (error) {
    res.json({ success: false, message: error.message });
        
    }


}