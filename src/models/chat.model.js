import mongoose, { Schema } from "mongoose";

const chatSchema = new Schema(
    {
        users : [{
            type: Schema.Types.ObjectId,
            ref: "User",
        }],
        latestMessage: {
            type: Schema.Types.ObjectId,
            ref: "Message"
        },
    },
    {
        timestamps: true
    }
)

export const Chat = mongoose.model("Chat",chatSchema);