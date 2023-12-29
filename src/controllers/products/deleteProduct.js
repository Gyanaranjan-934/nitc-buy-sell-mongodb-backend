import { Product } from "../../models/product.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const deleteProduct = asyncHandler(async (req, res) => {
    try {
        const { id } = req.body;

        const user = req.user?._id;

        // Fetch the product by ID
        const product = await Product.findById(id);

        if (!product) {
            throw new ApiError(404, "Product not found");
        }

        // Check if the user is the owner of the product
        if (!user.equals(product?.seller)) {
            throw new ApiError(400, "You are not the seller of this product");
        }

        // Check if the product is already sold
        if (product?.sold) {
            throw new ApiError(400, "You have sold the item already, so you cannot delete it");
        }

        // delete the product
        const deleteProduct = await Product.findByIdAndDelete(product._id);

        if (!deleteProduct) {
            throw new ApiError(400, "Error in deleting the product, please try again later");
        }

        return res.status(200).json(new ApiResponse(200, deleteProduct, "Product deleted successfully"));

    } catch (error) {
        // Handle errors and return appropriate response
        res.status(error?.statusCode || 500).json({
            message: error?.message || "Internal Server Error",
            data: null,
            success: false,
            errors: error?.errors || [],
        });
    }
})

export default deleteProduct