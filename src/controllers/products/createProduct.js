import { Category } from "../../models/category.model.js";
import { Product } from "../../models/product.model.js";
import { Tag } from "../../models/tag.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../../utils/cloudinary.js";

const createProduct = asyncHandler(async (req, res) => {
    try {
        let { name, description, price, condition, category } = req.body;

        const images = req.files

        // check for the category
        // check if the category is new category or provided a category object
        let productCategory = "";
        if (typeof category === "object" && category !== null) {
            category = await JSON.parse(category)
            productCategory = category._id;
        } else {
            // create a new category
            const oldCategory = await Category.findOne({ name: category })
            if (!oldCategory) {
                const newCategory = await Category.create({ name: category });
                productCategory = newCategory._id;
            } else {
                productCategory = oldCategory._id;
            }
        }

        console.log(req.body);
        console.log(req.files);
        if (!name || !price || isNaN(Number.parseFloat(price)) || images?.length === 0) {
            throw new ApiError(400, "Invalid input. Please provide valid values for all required fields.");
        }


        const slug = name.split(" ").join("-");


        const { tags } = req.body
        let tagsArray = [];
        if (tags && tags.length > 0) {
            // fetch the tags from db and store it in product tag array
            // for(let tag in tags){
            //     // create if not already present else just return it

            // }   
            tags?.map(async (tag) => {
                const oldTag = await Tag.findOne({ name: tag });
                if (oldTag) {
                    tagsArray.push(oldTag);
                } else {
                    const newTag = await Tag.create({ name: tag });
                    tagsArray.push(newTag);
                }
            })
        }

        // set all images urls
        const imageUrls = [];

        // Inside your loop
        for (let i = 0; i < images.length; i++) {
            let imageLocalPath = images[i]?.path;

            if (imageLocalPath) {
                const imageCloudinaryUrl = await uploadOnCloudinary(imageLocalPath);
                if (imageCloudinaryUrl) {
                    imageUrls.push(imageCloudinaryUrl.url);
                }
            }
        }


        const product = await Product.create({
            name,
            description,
            price: price,
            images: imageUrls,
            condition,
            seller: req.user,
            slug,
            category: productCategory,
            tags: tagsArray
        })

        const categroyObject = await Category.findById(productCategory);
        categroyObject.products.push(product);
        await categroyObject.save();

        if (product) {
            return res.status(201).json(new ApiResponse(200, product, "Product created successfully"));
        } else {
            throw ApiError(400, "Product not created due to some error");
        }

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

export default createProduct