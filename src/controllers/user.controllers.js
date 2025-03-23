import { ApiError } from '../utils/ApiError.js';
import {asyncHandler, asynchandler} from '../utils/asynchandler.js';
import {User} from '../models/user.models.js';
import {uploadOnCloudinary} from '../utils/cloudinary.js';
import {ApiResponse} from '../utils/ApiResponse.js';
import jwt from 'jsonwebtoken';

const generateAccessTokenAndRefreshToken = async(userId) => {
    try{
        const user = await User.findById(userId)
        //small check for user existance 

        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        user.refreshToken = refreshToken
        await user.save({validateBforeSave:false})
        return {accessToken,refreshToken}
    }catch(error){

        throw new ApiError(500,'Failed to generate access token and refresh token')

    }
} 



const registerUser = asynchandler(async(req,res) => 
    {
       const {fullname,email,password} = 
       req.body;
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
 console.warn("req.files");
 const avtarLocalpath = req.files?.avtar[0]?.path
 const coverLocalpath = req.files?.coverImage[0]?.path
    if(!avtarLocalpath){
        throw new ApiError(400,'Avtar file is missing') ;
    }
//    const avtar = await uploadOnCloudinary(avtarLocalpath);
//    let coverImage = ""
//     if(coverLocalpath){
//          coverImage = await uploadOnCloudinary(coverImage)
//     }

let avtar ;
try {
    avtar = await uploadOnCloudinary(avtarLocalpath);
    console.log("uploaded avtar",avtar);
} catch (error) {
    console.log("error uploading avtar",error);
    throw new ApiError(500,'Failed to upload avtar')

    
}



let coverImage ;
try {
    avtar = await uploadOnCloudinary(coverLocalpath);
    console.log("uploaded coverImage",coverImage);
} catch (error) {
    console.log("error uploading coverImage",error);
    throw new ApiError(500,'Failed to upload coverImage')

    
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

   const loginUser = asynchandler(async (req, res) => {
    // Get data from body
    const { email, username, password } = req.body;

    // Validation
    if (!email) {
        throw new ApiError(400, 'Email is required');
    }

    const user = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    // Validate password
    const isPasswordCorrect = await user.isPasswordCorrect(password);

    if (!isPasswordCorrect) {
        throw new ApiError(401, 'Invalid credentials');
    }

    const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user._id);

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
    };

    return res
        .status(200)
        .cookie('refreshToken', refreshToken, options)
        .cookie('accessToken', accessToken, options)
        .json(new ApiResponse(
            200,
            { user, accessToken, refreshToken },
            "User logged in successfully"
        ));
});

//logout part 

const logoutUser = asyncHandler(async(req,res) => {
    await User.findByIdAndUpdate(
    req.user._id,{
        $set:{
            refreshToken:'undefined'
    }

},
{new:true}

    )
    const options = {
     httpOnly: true,
    secure:process.env.NODE_ENV === 'production'
    }

    return res
    .status(200)    
    .cookie('refreshToken','undefined',options)
    .cookie('accessToken','undefined',options)
    .json(new ApiResponse(200,{},'User logged out successfully'));

})

//refresh token part
const refreshAccessToken = asyncHandler(async(req,res) => 
{
    const incomingRefreshToken = req.cookies.refreshToken ||
    req.body.refreshToken 
    if(!incomingRefreshToken){
        throw new ApiError(401,'Refresh token is required')
    }

    try {
      const decodeToken =   jwt.verify(incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET)
            const user  = await User.findById(decodeToken?._id)
            if(!user){
                throw new ApiError(404,'Invalid refresh token')
            }

            if (incomingRefreshToken !== user?.refreshToken){
                throw new ApiError(401,'Invalid refresh token')
            }

            const options = {
                httpOnly: true,
                secure:process.env.NODE_ENV === 'production'
            }

        const {accessToken,refreshToken:newRefreshToken} = 
         await   generateAccessTokenAndRefreshToken(user._id)

            return res
            .status(200)
            .cookie('refreshToken',accessToken,options)
            .cookie('accessToken',newRefreshToken,options)
            .json(new ApiResponse(
                200,{accessToken,refreshToken:newRefreshToken},
                ' Access token refreshed successfully'));




    } catch (error) {
        throw new ApiError(401,'Something went wrong while refreshing access token')
    }
})
    


const changeCurrentPassword = asyncHandler(async(req,res) =>
     {
        const {oldPassword,newPassword} = req.body;
        const user =await User.findById(req.user?._id)
        user.isPasswordValid = await user.isPasswordCorrect
        (oldPassword)
        if(!user.isPasswordValid){
            throw new ApiError(400,'Old password is incorrect')
        }
        user.password = newPassword;
        await user.save({validateBeforeSave:false})
        return res.status(200).json(new ApiResponse(200,
            'Password changed successfully'))
     })

const getCurrentUser = asyncHandler(async(req,res) =>
     {
        return res
        .status(200)
        .json(new ApiResponse(200,req.user,'Current user details'))
     })

const updateAccountDetails = asyncHandler(async(req,res) =>
     {
        if(!fullname || !email){
        throw new ApiError(400,'All fields are required');  
        }
  

const user = await User.findByIdAndUpdate(req.user?._id,
   {
        $set:{
            fullname,
            email
        }
    },
    
     { new:true}
      ).select('-password -refreshToken')

    return res
    .status(200)
    .json(new ApiResponse(200,user,'Account details updated successfully'))
 }) 



const updateUserAvtar = asyncHandler(async(req,res) =>   
    {
        const avtarLocalpath = req.files?.avtar[0]?.path
        if(!avtarLocalpath){
            throw new ApiError(400,'Avtar file is required')
        }
        const avtar = await uploadOnCloudinary(avtarLocalpath)
        const user = await User.findByIdAndUpdate(req.user?._id,
            {
                $set:{
                    avtar:avtar.url
                }
            },
            {new:true}
        ).select('-password -refreshToken')
        return res
        .status(200)
        .json(new ApiResponse(200,user,'Avtar updated successfully'))
    })

const updateUserCoverImage = asyncHandler(async(req,res) =>
    {

        const coverImageLocalpath = req.files?.coverImage[0]?.path
        if(!coverImageLocalpath){
            throw new ApiError(400,'Cover Image file is required')
        }
        const coverImage = await uploadOnCloudinary(coverImageLocalpath)
        const user = await User.findByIdAndUpdate(req.user?._id,
            {
                $set:{
                    coverImage:coverImage.url
                }
            },
            {new:true}
        ).select('-password -refreshToken')
        return res
        .status(200)
        .json(new ApiResponse(200,user,'Cover Image updated successfully'))
    })







export{
   registerUser,
   loginUser
 ,refreshAccessToken
,logoutUser
,changeCurrentPassword
,getCurrentUser
,updateAccountDetails
,updateUserAvtar
,updateUserCoverImage 
 }
