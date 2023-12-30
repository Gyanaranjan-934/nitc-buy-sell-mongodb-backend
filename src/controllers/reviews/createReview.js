import { Product } from "../../models/product.model.js";
import { Review } from "../../models/review.model.js";
import { User } from "../../models/user.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const createRating = asyncHandler(async (req, res) => {
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

        // Check if the product is already sold
        if (!product?.sold) {
            throw new ApiError(400, "This is product not sold, so you cannot rate/review this product");
        }

        // Check if the user is the buyer of the product
        if (!buyerId.equals(product?.buyer)) {
            throw new ApiError(400, "You are not the buyer of this product");
        }

        if(product?.review){
            throw new ApiError(400, "This product is already reviewed");
        }

        let fRating = 0;
        if (rating) {
            fRating = rating
        }
        let fReview = "";
        if (review) {
            fReview = review
        }

        const finalRating = await Review.create({
            product: product?._id,
            review: fReview,
            rating: fRating
        })

        if (finalRating) {
            
            product.review = finalRating?._id;
            
            const seller = await User.findById(product?.seller);
            
            // update the rating details of the seller
            const newTotalNoRating = seller?.tot_no_rating + 1;
            const newTotalRating = seller?.tot_rating + fRating
            
            seller.tot_no_rating = newTotalNoRating;
            seller.tot_rating = newTotalRating;

            await seller.save();
            await product.save();

            return res.status(201).json(new ApiResponse(
                201,
                {
                    finalRating,
                    seller,
                    product
                },
                "Rating created successfully"
            ));
        } else {
            throw new ApiError(500,"Failed to create rating");
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

export default createRating