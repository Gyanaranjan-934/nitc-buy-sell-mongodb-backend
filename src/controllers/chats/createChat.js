import { Chat } from "../../models/chat.model.js";
import { User } from "../../models/user.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const createChat = asyncHandler(async (req, res) => {
    const { id } = req.body;
    const user1 = req.user?._id;

    try {
        if (!id) {
            throw new ApiError(400, "Id must be provided");
        }

        // check the id of the user exist or not
        const user2 = await User.findById(id);

        if (!user2) {
            throw new ApiError(404, "User not found");
        }

        if(user1.equals(user2._id)){
            throw new ApiError(400, "You cannot create chat with yourself");   
        }

        // check if there exist a chat between both users

        const prevChat = await Chat.findOne(
            {
                users: {
                    $all: [user1, user2?._id]
                }
            }
        ).populate("users","-refreshToken -password");        

        if(prevChat){
            return res.status(200).json(new ApiResponse(200,prevChat,"Chat fetched successfully"));   
        }

        const chat = await Chat.create({
            users: [user1, user2._id]
        });

        if (!chat) {
            throw new ApiError(400, "Error in creating chat");
        }

        return res.status(200).json(new ApiResponse(
            200,
            {
                user1:req.user,
                user2,
                chat
            },
            "Chat created successfully"
        ));

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

export default createChat;