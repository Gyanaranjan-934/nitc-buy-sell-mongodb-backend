import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import createRating from "../controllers/reviews/createReview.js";
import updateReview from "../controllers/reviews/updatingReview.js";
import deleteReview from "../controllers/reviews/deleteReview.js";

const router = Router();

router.route('/create-review').post(verifyJWT,createRating);
router.route('/update-review').put(verifyJWT,updateReview);
router.route('/delete-review').delete(verifyJWT,deleteReview);

export default router;