import { Router } from "express";
import registerUser from '../controllers/auth/registerUser.js'
import {upload} from '../middlewares/multer.middleware.js'
import loginUser from "../controllers/auth/loginUser.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import logoutUser from "../controllers/auth/logoutUser.js";
import refreshAccessToken from "../controllers/auth/refreshAccessToken.js";
import updateUserAvatar from "../controllers/auth/updateUserAvatar.js";
import updateAccountDetails from "../controllers/auth/updateAccountDetails.js";
import changeCurrentPassword from "../controllers/auth/changeCurrentPassword.js";

const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
    ]),
    registerUser
    )

router.route("/login").post(loginUser)

// secured routes
router.route("/logout").post(verifyJWT,logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/update-avatar").put(verifyJWT,upload.single("avatar"),updateUserAvatar)
router.route('/update-account').put(verifyJWT,updateAccountDetails)
router.route('/update-password').put(verifyJWT,changeCurrentPassword)

export default router;