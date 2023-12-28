import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        chat: {
            type: Schema.Types.ObjectId,
            ref: "Chat",
            required: true
        },
        text: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
)

export const Message = mongoose.model('Message',messageSchema);