import { asyncHandler } from "../../utils/asyncHandler.js"
import {ApiError} from '../../utils/ApiError.js'
import { User } from '../../models/user.model.js'
import {uploadOnCloudinary} from '../../utils/cloudinary.js'
import {ApiResponse} from '../../utils/ApiResponse.js'

const registerUser = asyncHandler(async(req,res)=>{
    try {
        const {fullName,email,username,password, phoneNo} = req.body;
        // console.log(req);
        
        if([fullName, email, username, password,phoneNo].some((field)=>field?.trim()==="")){
            throw new ApiError(400,"All fields are required");
        }

        const isValidPhoneNumber = /^\d{10}$/.test(phoneNo);
        if(!isValidPhoneNumber){
            throw new ApiError(400,"Phone number is invalid");
        }
    
        const existingUser = await User.findOne({
            $or:[{username},{email},{phoneNo}]
        })
    
        if(existingUser){
            throw new ApiError(409,"User with this email or username or phone number already exists");
        }
        // console.log(req.files);
        // console.log("Existing user checked");
        const avatarLocalPath = req.files?.avatar[0]?.path;
        
    
        if(!avatarLocalPath)throw new ApiError(400,"Local Avatar is required");
    
        // console.log("Avatar local path checked");
    
        const avatar = await uploadOnCloudinary(avatarLocalPath)
        
    
        if(!avatar){
            throw new ApiError(400,"Avatar is required");
        }
    
        // console.log("cloudinary upload successful");
    
        const user = await User.create({
            fullName,
            avatar:avatar.url,
            email,
            password,
            username: username.toLowerCase(),
            phoneNo
        })
    
        const createdUser = await User.findById(user._id).select(
            "-password -refreshToken"
        )
        
        if(!createdUser){
            throw new ApiError(500,"Something went wrong creating new user");
        }
    
        // console.log(createdUser);

        return res.status(201).json(new ApiResponse(201,createdUser,"User created successfully"));
    } catch (error) {
        res.status(error?.statusCode || 500).json({
            mesage: error?.message || "Internal Server Error"
        })
    }
})

export default registerUser