import express from 'express'
import { addCourse, educatorDashboardData, getEducatorCourses, getEnrolledStudentsData, updateRoleToEducator } from '../controllers/educatorController.js'
import upload from '../config/multer.js'
import { protectedEducator } from '../middlewares/AuthMiddleware.js'

const educatorRouter = express.Router()

// Add Educator Role 
educatorRouter.get('/update-role', updateRoleToEducator)
educatorRouter.post('/add-course', upload.single('image'), protectedEducator, addCourse )
educatorRouter.get('/courses', protectedEducator, getEducatorCourses )
educatorRouter.get('/dashboard', protectedEducator, educatorDashboardData )
educatorRouter.get('/enrolled-students', protectedEducator, getEnrolledStudentsData )

export default educatorRouter