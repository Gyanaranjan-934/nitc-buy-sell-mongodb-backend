import mongoose, { Schema } from "mongoose";

const categorySchema = new Schema(
    {
        products: [ {
            type: Schema.Types.ObjectId,
            ref: "Product"
        }],
        name: {
            type: String,
            required: true,
            index: true
        },
        avatar: {
            type: String,
        }
    },
    {
        timestamps: true,
    }
)

export const Category = mongoose.model("Category",categorySchema);