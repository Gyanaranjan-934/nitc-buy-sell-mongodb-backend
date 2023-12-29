import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import createProduct  from "../controllers/products/createProduct.js";
import { upload } from "../middlewares/multer.middleware.js";
import createCategory from "../controllers/others/createCategory.js";
import createTag from "../controllers/others/createTag.js";
import updateProduct from "../controllers/products/updateProduct.js";
import deleteProduct from "../controllers/products/deleteProduct.js";
import getCategories from "../controllers/others/getCategories.js";
import getTags from "../controllers/others/getTags.js";

const router = Router();


router.route('/create-product').post(
    verifyJWT,
    upload.array('images',5),
    createProduct
);

router.route('/create-category').post(
    verifyJWT,
    upload.single("avatar"),
    createCategory
);

router.route('/create-tag').post(verifyJWT,createTag);

router.route('/update-product').put(
    verifyJWT,
    upload.array('images',5),
    updateProduct
);

router.route('/delete-product').delete(verifyJWT,deleteProduct);

router.route('/get-categorys').get(getCategories);
router.route('/get-tags').get(getTags);

export default router