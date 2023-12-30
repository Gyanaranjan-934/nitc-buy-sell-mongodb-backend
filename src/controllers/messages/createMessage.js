import { Message } from "../../models/message.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const createMessage = asyncHandler(async (req, res) => {
    try {

        const { chatId, messageBody } = req.body;

        const user = req.user?._id;

        if (!messageBody || messageBody.trim() === '') {
            throw new ApiError(400, "Message body is required");
        }

        const message = await Message.create({
            sender: user,
            chat: chatId,
            messageBody: messageBody?.trim()
        })

        if (!message) {
            throw new ApiError(400, "Error creating message");
        }

        return res.status(201).json(new ApiResponse(201, message, "Message created successfully"));

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

export default createMessage