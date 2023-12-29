import { Product } from "../../models/product.model.js";
import { Review } from "../../models/review.model.js";
import { User } from "../../models/user.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const deleteReview = asyncHandler(async (req, res) => {

    const reviewId = req.body?.id;
    const buyerId = req.user?._id;

    try {
        // check if the rating exist or not  
        const review = await Review.findById(reviewId);

        if (!review) {
            throw new ApiError(404, "Review Not Found");
        }

        const product = await Product.findOne({ review: review?._id });

        // check if the requested user is the buyer of the product
        if (!buyerId.equals(product?.buyer)) {
            throw new ApiError(400, "You are not the buyer of this product")
        }

        const prevRating = review?.rating;

        // delete the review from the document
        const deletedReview = await Review.deleteOne({ _id: reviewId });

        // find the rating details of the seller
        const sellerData = await User.findById(product?.seller);

        const no_of_ratings = sellerData.tot_no_rating - 1;
        const total_ratings = (sellerData.tot_rating - prevRating)
        // update the rating details of the seller
        sellerData.tot_rating = total_ratings;
        sellerData.tot_no_rating = no_of_ratings;
        // eslint-disable-next-line no-unused-vars
        await sellerData.save();
        product.review = null;
        await product.save();

        return res.status(201).json(new ApiResponse(
            201,
            {
                deletedReview,
                sellerData,
                product
            },
            "Rating deleted successfully"
        ));

    } catch (error) {
        // Handle errors and return appropriate response
        res.status(error?.statusCode || 500).json({
            message: error?.message || "Internal Server Error",
            data: null,
            success: false,
            errors: error?.errors || [],
        });
    }
});

export default deleteReview