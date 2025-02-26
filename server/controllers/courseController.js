import Course from '../models/Course.js'
import Stripe from 'stripe'
import { Purchase } from '../models/Purchase.js'
import User from '../models/User.js'
import normalizePath from 'normalize-path'

// Get All courses 

export const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find({isPublished: true}).select(['-courseContent', '-enrolledStudents']).populate({path:"educator"})
        res.json({success: true, courses})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

// Get Course By Id 

export const getCourseId = async (req, res) => {
    const {id} = req.params

    try {
        const courseData = await Course.findById(id).populate({path: 'educator'}) 
        //  Remove lectureUrl if isPreview is false 
        courseData.courseContent.forEach(chapter => {
            chapter.chapterContent.forEach(lecture => {
                if (!lecture.isPreviewFree) {
                    lecture.lectureUrl = ''
                }
            })
        })
        res.json({success: true, courseData})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

// purchase course
export const purchaseCourse = async (req, res) => {
    try {
        const {courseId} = req.body
        const {origin} = req.headers
        const userId = req.auth.userId
        const userData = await User.findById(userId)
        const courseData = await Course.findById(courseId)

        if (!userData || !courseData) {
            return res.json({success: false, message: 'Course or User not found'})
        }
        const purchaseData = {
            courseId : courseData._id,
            userId,
            amount: (courseData.coursePrice - courseData.discount * courseData.coursePrice / 100).toFixed(2)
        }

        const newPurchase = await Purchase.create(purchaseData)

        // stripe getway initialized
        const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY)
        const currency = process.env.CURRENCY.toLowerCase()

        // crating line item for stripe
        const line_item = [{
            price_data: {
                currency,
                product_data: {
                    name: courseData.courseTitle
                },
                unit_amount: Math.floor(newPurchase.amount) * 100
            },
            quantity: 1
        }]

        const session = await stripeInstance.checkout.sessions.create({
            success_url: `${origin}/loading/my-enrollments`,
            cancel_url: `${origin}/`,
            line_items: line_item,
            mode: 'payment',
            metadata: {
                purchaseId: newPurchase._id.toString()
            }
        })

        res.json({success: true, session_url: session.url})
        
    
    } catch (error) {
        res.json({success: false, message: error.message})
        
    }
}