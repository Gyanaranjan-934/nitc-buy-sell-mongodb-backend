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
    const user = req.user?._id;

    try {
        let queryConditions = { sold: false, seller: { $nin: [user?._id] } };

        if (name) {
            const regExpression = new RegExp(name, 'i');
            queryConditions.$or = [
                { name: regExpression },
                { description: regExpression },
                { slug: regExpression }
            ];
        }

        const products = await Product.find(queryConditions)
            .populate({
                path: "seller",
                select: "-refreshToken -password"
            })
            .populate("category")
            .populate("review");

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