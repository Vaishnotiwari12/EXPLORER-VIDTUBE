import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true, 
            index: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowecase: true,
            trim: true, 
        },
        fullname: {
            type: String,
            required: true,
            trim: true, 
            index: true
        },
        avatar: {
            type: String, // cloudinary url
            required: true,
        },
        coverImage: {
            type: String, // cloudinary url
        },
        watchHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: "Video"
            }
        ],
        password: {
            type: String,
            required: [true, 'Password is required']
        },
        refreshToken: {
            type: String
        }

    },
    {
        timestamps: true
    }
)


userSchema.pre("save", async function(){

    if(!this.isModified("password")) return next()    

    this.password = bcrypt.hash(this.password,10)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password){
   return await bcrypt.compare(password,this.password)   
}

UserSchema.methods.generateAccessToken = function(){
    //short lived access tokens
   return jwt.sign({
      _id:this._id,
        username:this.username,
        email:this.email,
        fullname:this.fullname,
  },
  process.env.ACCESS_TOKEN_SECRET,
  {expiresIn:process.env.ACCESS_TOKEN_EXPIRY},
)
}
 UserSchema.methods.generateRefreshToken = function(){
     //short lived access tokens
    return jwt.sign({
       _id:this._id,
         username:this.username,
         email:this.email,
         fullname:this.fullName,
   },
   process.env.REFRESH_TOKEN_SECRET,
   {expiresIn:process.env.REFRESH_TOKEN_EXPIRY},
 )
 }

export const User = mongoose.model("User", userSchema)  // export the model
// Compare this snippet from src/models/user.models.js: 