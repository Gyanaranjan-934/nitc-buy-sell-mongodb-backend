import { Chat } from "../../models/chat.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const getChats = asyncHandler(async (req, res) => {
    const user = req.user?._id;

    try {
        const chats = await Chat.find({
            users: {
                $elemMatch: {
                    $eq: user,
                },
            },
        })
            .populate("users", "-refreshToken -password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 })
            .lean(); // Convert Mongoose documents to plain JavaScript objects

        if (!chats) {
            throw new ApiError(400, "Error in fetching the chats");
        }

        return res.status(200).json(
            new ApiResponse(
                200,
                chats,
                chats.length > 0 ? "Chats fetched successfully" : "No chats found"
            )
        );
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

export default getChats;
