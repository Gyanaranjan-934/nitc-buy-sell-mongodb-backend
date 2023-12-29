import mongoose, { Schema } from "mongoose";

const productSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            index: true
        },
        seller: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        buyer: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        description: {
            type: String,
            required: true,
        },
        slug: {
            type: String,
            required: true,
        },
        images: {
            type: [{
                type: String,
                required: true,
            }],
            validate: [
                {
                    validator: function (value) {
                        return value.length <= 5;
                    },
                    message: '{PATH} must contain 5 or fewer items',
                },
            ],
        },        
        condition: {
            type: String,
            enum: ['Good', 'Average', 'Bad']
        },
        sold: {
            type: Boolean,
            default: false
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        finalPrice: {
            type: Number,
            min: 0,
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: 'Category'
        },
        review: {
            type: Schema.Types.ObjectId,
            ref: 'Review',
            default: null
        },
        tags: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Tag'
            }
        ]

    },
    {
        timestamps: true,
    }
)

export const Product = mongoose.model("Product", productSchema)