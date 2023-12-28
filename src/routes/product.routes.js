import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import createProduct  from "../controllers/products/createProduct.js";
import { upload } from "../middlewares/multer.middleware.js";
import createCategory from "../controllers/others/createCategory.js";
import createTag from "../controllers/others/createTag.js";

const router = Router();


router.route('/create-product').post(
    verifyJWT,
    upload.fields([
        {
            name: 'images',
            maxCount: 5,
        }
    ]),
    createProduct
)
router.route('/create-category').post(
    verifyJWT,
    upload.single("avatar"),
    createCategory
)
router.route('/create-tag').post(verifyJWT,createTag)



export default router