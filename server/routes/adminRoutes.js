import express from 'express'
import { adminDashboardData, getAllCourses, getAllUsers } from '../controllers/adminController.js'


const adminRoutes = express.Router()

adminRoutes.get('/all-courses', getAllCourses)
adminRoutes.get('/all-users', getAllUsers)
adminRoutes.get('/dashboard',  adminDashboardData )

export default adminRoutes