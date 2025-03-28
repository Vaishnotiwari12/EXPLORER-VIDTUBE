import {v2 as cloudinary} from 'cloudinary';    
import dotenv from 'dotenv';
dotenv.config();
import fs from 'fs';
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET       
})

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath){
            const response =  await cloudinary.uploader.upload(localFilePath,{
                resource_type:"auto",
            })
            console.log("Uploaded on Cloudinary",response) 
            // once uploaded, delete the file from the local storage
            fs.unlinkSync(localFilePath)
            return response
            return null
        }
    } catch (error) {
        fs.unlinkSync(localFilePath)
        return null
    }
}

export {uploadOnCloudinary}
