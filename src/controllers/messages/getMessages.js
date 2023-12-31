import { Message } from "../../models/message.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const getMessages = asyncHandler(async (req, res) => {
    try {
        const { chatId } = req.body;

        const messages = await Message.find({ chat: chatId }).sort({ updatedAt: -1 });

        if(!messages){
            throw new ApiError(400,"Error getting messages");
        }

        return res.status(200).json(new ApiResponse(200,messages,"Messages fetched successfully"));

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

export default getMessages