import { Tag } from "../../models/tag.model.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const getTags = asyncHandler(async (req, res) => {
    try {
        const query = req.query ? req.query : "";
        const tags = await Tag.find(
            {
                name: {
                    $regex: new RegExp(query, 'i')
                }
            }
        );

        return res.status(200).json(new ApiResponse(200, tags, "All tags fetched successfully"));
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

export default getTags