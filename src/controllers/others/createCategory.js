import { Category } from "../../models/category.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../../utils/cloudinary.js";

const createCategory = asyncHandler(async(req,res) => {
    try {
        const {name} = req.body;
        if(!name) {
            return res.status(400).json(new ApiError(400,"Name required"));
        }

        const avatarLocalPath = req.file?.path;
        let cloudinaryPath = null;

        if(avatarLocalPath) {
            cloudinaryPath = await uploadOnCloudinary(avatarLocalPath);
        }

        const category = await Category.create({
            name,
            avatar: cloudinaryPath?.url || ""
        })

        if(!category){
            return res.status(400).json(new ApiError(400,"Error in creating category"));
        }

        return res.status(200).json(new ApiResponse(200,category,"Category created successfully"));

    } catch (error) {
        console.error(error);
        res.status(error?.statusCode || 500).json({
            message: error?.message || "Internal Server Error",
            data: null,
            success: false,
            errors: error?.errors || [],
        });
    }
})

export default createCategory