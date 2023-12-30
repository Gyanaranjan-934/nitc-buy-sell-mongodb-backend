import { Review } from "../../models/review.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const getOneReview = asyncHandler(async (req, res) => {
    const { id } = req.query;

    try {
        const review = await Review.findById(id);
        if (!review) {
            throw new ApiError(404, "Review not found");
        }
        return res.status(200).json(new ApiResponse(200, review, "Review fetched successfully"));
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

export default getOneReview;