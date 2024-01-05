import { Product } from "../../models/product.model.js";
import { User } from "../../models/user.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { deleteOnCloudinary, uploadOnCloudinary } from "../../utils/cloudinary.js";

const updateProduct = asyncHandler(async (req, res) => {
    try {
        // Destructure request body
        const { id, name, description, condition, price, finalPrice, category, buyer } = req.body;

        // Check for required fields
        if (!id || !name || !description || !condition || !price || !category) {
            throw new ApiError(400, "All the required fields must be set.");
        }

        console.log(req.body);

        let { sold } = req.body;
        const images = req.files;
        console.log(images);
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
            throw new ApiError(400, "You have sold the item already, so you cannot change it");
        }


        // Initialize newImageUrls with existing images
        let newImageUrls =[];
        if(images.length > 0) {
            let oldImageUrls = product.images;
            
            for (let index = 0; index < oldImageUrls.length; index++) {
                const url = oldImageUrls[index];
                await deleteOnCloudinary(url);
            }
            for (let i = 0; i < images.length; i++) {
                const imageLocalPath = images[i].path;
                
                const imageCloudinaryUrl = await uploadOnCloudinary(imageLocalPath);
                if (imageCloudinaryUrl) {
                    newImageUrls.push(imageCloudinaryUrl.url);
                }
            }
        }

        // Initialize variables for sold products
        let actualFinalPrice = 0;
        let actualBuyer = null;

        // If the item is sold, find the buyer from the email provided in the request body
        if (sold) {

            if (!buyer || !finalPrice || isNaN(Number.parseFloat(finalPrice))) {
                throw new ApiError(400, "Please enter the email address of the buyer and final price of the product");
            }

            actualFinalPrice = Number.parseFloat(finalPrice);

            const buyerData = await User.findOne({ email: buyer });

            if (buyerData) {
                actualBuyer = buyerData?._id;
            } else {
                throw new ApiError(400, "Buyer not found, please give a valid email address of the buyer");
            }
        }

        // Update the product
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            {
                name,
                description,
                condition,
                price,
                sold,
                buyer: actualBuyer,
                finalPrice: actualFinalPrice,
                images: newImageUrls.length>0 ? newImageUrls : product.images
            },
            {
                new: true,
            }
        );
        console.log(updatedProduct);
        if (!updatedProduct) {
            throw new ApiError(500, "Error in updating product, please try again later");
        }

        // Return the updated product
        return res.status(201).json(new ApiResponse(201, updatedProduct, "Product updated successfully"));

    } catch (error) {
        console.log(error);
        // Handle errors and return appropriate response
        res.status(error?.statusCode || 500).json({
            message: error?.message || "Internal Server Error",
            data: null,
            success: false,
            errors: error?.errors || [],
        });
    }
});

export default updateProduct;
