import { clerkClient } from "@clerk/express";

// middleware Routes 
export const protectedEducator = async (req, res, next) => {
    try {
        const userId = req.auth.userId
        const response = await clerkClient.users.getUser(userId)
        if (response.publicMetadata.role !== 'educator') {
            return res.json({success:false, message: "uncathegorized Access"})
        }

        next()
    } catch (error) {
        return res.json({success:false, message: error.message})
        
    }
}