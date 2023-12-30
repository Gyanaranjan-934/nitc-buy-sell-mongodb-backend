import { Chat } from "../models/chat.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";


// This middleware is responsible for verfiy the requesting user is actuall user of that chat or not
export const verifyUserChat = asyncHandler(async (req, res, next) => {
    try {
        const { chatId } = req.body;
        const user = req.user?._id;
    
        const chat = await Chat.findOne({
            _id: chatId,
            users: {
                $in: [user]
            }
        });
    
        if(!chat) {
            throw new ApiError(400,"You are not the member of this chat");
        }
    
        next();
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