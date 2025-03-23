import jwt from "jsonwebtoken";
import {User} from "../models/user.models.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {ApiError} from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asynchandler.js";


export const verifyJWT = asyncHandler(async(req,_,next) => {

const token = req.cookies?.accessToken || req.headers
("authorization")?.replace("Bearer ","")

if(!token){
    throw new ApiError(401,"Unauthorized")

}
 try {
    const decodedToken = jwt.verify(token,process.
        env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id)
        Selection("-password -refreshToken")
        if(!user){
            throw new ApiError(404,"Unauthorized")

        }

        req.user = user
        next()
    
 } catch (error) {
    throw new ApiError(401,error?.message || "Invalid Access Token")
    
 }

})