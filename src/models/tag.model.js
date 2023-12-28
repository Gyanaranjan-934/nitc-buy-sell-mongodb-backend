import mongoose, { Schema } from "mongoose";

const tagSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        products: [
            {
                type: Schema.Types.ObjectId,
                ref: "Product"
            }
        ],
    }
)

export const Tag = mongoose.model('Tag',tagSchema);