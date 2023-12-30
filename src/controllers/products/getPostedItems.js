import { Product } from "../../models/product.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const getPostedItems = asyncHandler(async (req, res) => {
    try {
        const user = req.user?._id;

        const products = await Product.find({
            seller: user
        });

        if (!products) {
            throw new ApiError(404, "You have not posted any products");
        }

        return res.status(200).json(new ApiResponse(200, products, "All posted products fetched successfully"));

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

export default getPostedItems