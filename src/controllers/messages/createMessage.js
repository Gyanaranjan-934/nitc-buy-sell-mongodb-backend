import { Chat } from "../../models/chat.model.js";
import { Message } from "../../models/message.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const createMessage = asyncHandler(async (req, res) => {
    try {

        const { messageBody } = req.body;
        const {chatId} = req.params

        const user = req.user?._id;

        if (!messageBody || messageBody.trim() === '') {
            throw new ApiError(400, "Message body is required");
        }

        let message = await Message.create({
            sender: user,
            chat: chatId,
            messageBody: messageBody?.trim()
        })
        
        message = await Message.findById(message._id).populate("sender","-passwor -refreshToken")

        if (!message) {
            throw new ApiError(400, "Error creating message");
        }

        const chat = await Chat.findById(chatId);

        chat.latestMessage = message;

        await chat.save();

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