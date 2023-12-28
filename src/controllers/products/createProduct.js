import { Product } from "../../models/product.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../../utils/cloudinary.js";

const createProduct = asyncHandler(async (req, res) => {
    try {
        // console.log(req);
        const { name, description, price, condition, } = req.body;

        const { images } = req.files

        // console.log(req.files);

        if (!price || isNaN(Number.parseFloat(price)) || images.length === 0) {
            return res.status(400).json(new ApiError(400, "Invalid input. Please provide valid values for all required fields."));
        }


        const slug = name.split(" ").join("-");


        // set all images urls
        const imageUrls = [];
        console.log('req.files:', req.files);

        // Inside your loop
        for (let i = 0; i < images.length; i++) {
            console.log(`Processing image ${i + 1}:`, req.files?.images[i]);

            let imageLocalPath = req.files?.images[i]?.path;

            if (imageLocalPath) {
                const imageCloudinaryUrl = await uploadOnCloudinary(imageLocalPath);
                if (imageCloudinaryUrl) {
                    imageUrls.push(imageCloudinaryUrl.url);
                }
            }
        }


        const product = await Product.create({
            name,
            description,
            price: price,
            images: imageUrls,
            condition,
            seller: req.user,
            slug
        })

        if (product) {
            return res.status(201).json(new ApiResponse(200, product, "Product created successfully"));
        } else {
            return res.status(400).json(new ApiError(400, "Product not created due to some error"))
        }

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

export default createProduct