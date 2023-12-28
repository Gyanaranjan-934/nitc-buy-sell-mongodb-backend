import { Schema } from "mongoose";

const reviewSchema = new Schema(
    {
        buyer: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        review: {
            type: String,
        },
        rating: {
            type: Number,
        }
    }
)