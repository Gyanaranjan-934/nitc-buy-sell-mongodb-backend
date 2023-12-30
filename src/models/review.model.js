import mongoose, { Schema } from "mongoose";

const reviewSchema = new Schema(
    {
        product: {
            type: Schema.Types.ObjectId,
            ref: "Product"
        },
        review: {
            type: String,
        },
        rating: {
            type: Number,
        }
    }
)

export const Review = mongoose.model('Review',reviewSchema);