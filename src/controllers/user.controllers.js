import { ApiError } from '../utils/ApiError.js';
import {asynchandler} from '../utils/asynchandler.js';
import {User} from '../models/user.models.js';
import {uploadOnCloudinary} from '../utils/cloudinary.js';
import {ApiResponse} from '../utils/ApiResponse.js';
// import {ApiResponse} from '../utils/ApiResponse.js';
// import {registerUser} from '../controllers/user.controllers.js';
const registerUser = asynchandler(async(req,res) => {
    const {fullname,email,password} = req.body;
    //validation

    //check if user exists
    if(
        [fullname,username,email,password].some((field) => field?.trim() === '')
    ){
        throw new ApiError(400,'all fields are required');
    }
  const existedUser = await 
   User.findOne({
    $or:[{email},{username}]
   }) 
   if(existedUser){
           throw new ApiError(409,'User with this email or username already exists');
       }
 const avtarLocalpath = req.files?.avtar[0]?.path
 const coverLocalpath = req.files?.coverImage[0]?.path
    if(!avtarLocalpath){
        throw new ApiError(400,'Avtar file is missing') ;
    }
   const avtar = await uploadOnCloudinary(avtarLocalpath);
   let coverImage = ""
    if(coverLocalpath){
         coverImage = await uploadOnCloudinary(coverImage)
    }

    const User = await User.create({
        fullname,
        email,
        password,
        avtar,
        coverImage:coverImage?.url ||"",
    })

    const createUser = await User.findById(User._id).select('-password -refreshToken')

    if(!createUser){
        throw new ApiError(500,'something went wrong while registering user')


    }
     return res.status(201).json(new ApiResponse(200,'User registered successfully'))

   })

export {registerUser}