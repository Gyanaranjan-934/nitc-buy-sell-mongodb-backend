import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import createChat from "../controllers/chats/createChat.js";
import getChats from "../controllers/chats/getChats.js";
import { verifyUserChat } from "../middlewares/chat.middleware.js";
import createMessage from "../controllers/messages/createMessage.js";
import getMessages from "../controllers/messages/getMessages.js";

const router = Router();

router.route('/create-chat').post(verifyJWT,createChat);
router.route('/get-chats').get(verifyJWT,getChats);
router.route('/send-message').post(verifyJWT,verifyUserChat,createMessage);
router.route('/get-messages').get(verifyJWT,verifyUserChat,getMessages);

export default router