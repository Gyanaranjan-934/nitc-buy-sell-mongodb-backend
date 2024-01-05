import { asyncHandler } from "../../utils/asyncHandler.js";
import { Product } from '../../models/product.model.js';
import { ApiError } from '../../utils/ApiError.js'
import { ApiResponse } from '../../utils/ApiResponse.js'


const getOneProduct = asyncHandler(async (req, res) => {
    const { id } = req.query;

    try {
        const product = await Product
            .findById(id)
            .populate({
                path: "seller",
                select: "-refreshToken -password",
            }).populate("review");

        if (!product) {
            throw new ApiError(404, "Product not found");
        }
        return res.status(200).json(new ApiResponse(200, product, "Product fetched successfully"));
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

const getAllProducts = asyncHandler(async (req, res) => {
    const { name } = req.query;

    const nameQuery = name || "";

    const user = req.user?._id;

    try {
        const regExpression = new RegExp(nameQuery, 'i');
        const products = await Product.find({
            $and: [
                {
                    $or: [
                        { name: regExpression },
                        { description: regExpression },
                        { slug: regExpression }
                    ]
                },
                { isSold: false }, // Filter out sold products
                { seller: { $ne: user } }, // Filter out products from the current user
            ],
        }).populate({
            path: "seller",
            select: "-refreshToken -password"
        }).populate("review");

        if (!products || products.length === 0) {
            throw new ApiError(404, "Products not found");
        }

        return res.status(200).json(new ApiResponse(200, products, "Products fetched successfully"));
    } catch (error) {
        console.error(error);
        res.status(error?.statusCode || 500).json({
            message: error?.message || "Internal Server Error",
            data: null,
            success: false,
            errors: error?.errors || [],
        });
    }
});


export {
    getOneProduct,
    getAllProducts
}