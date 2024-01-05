import { Product } from "../../models/product.model.js";
import { Review } from "../../models/review.model.js";
import { User } from "../../models/user.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const updateReview = asyncHandler(async (req, res) => {
    
    const {id, rating, review } = req.body;
    
    if (!rating && !review) {
        throw new ApiError(400,"Please provide either a rating or a review");
    }
    try {
        const productId = id;
        const buyerId = req.user?._id;

        // Fetch the product by ID
        const product = await Product.findById(productId);

        if (!product) {
            throw new ApiError(404, "Product not found");
        }

        // Check if the user is the buyer of the product
        if (!buyerId.equals(product?.buyer)) {
            throw new ApiError(400, "You are not the buyer of this product");
        }

        if(!product?.review){
            throw new ApiError(404, "Review for this product does not exist");
        }

        let finalRating = 0;
        if (rating) {
            finalRating = rating
        }
        let finalReview = "";
        if (review) {
            finalReview = review
        }

        const oldReview = await Review.findOne(product?.review);

        const updatedReview = await Review.findByIdAndUpdate(
            {_id: product?.review},
            {
                rating: finalRating,
                review: finalReview
            },
            {
                new: true,
            }
        )

        if (updatedReview) {

            // const finalReview = await Review.findById()
            
            product.review = finalRating?._id;
            
            const seller = await User.findById(product?.seller);
            
            // update the rating details of the seller
            const newTotalNoRating = seller?.tot_no_rating;
            const newTotalRating = (seller?.tot_rating-oldReview.rating) + finalRating;
            
            seller.tot_no_rating = newTotalNoRating;
            seller.tot_rating = newTotalRating;
            
            await seller.save();

            return res.status(201).json(new ApiResponse(
                201,
                {
                    updatedReview,
                    seller,
                    product
                },
                "Rating updated successfully"
            ));
        } else {
            throw new ApiError(500,"Failed to update rating");
        }
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

export default updateReview