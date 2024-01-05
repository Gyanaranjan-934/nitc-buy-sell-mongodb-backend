import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import createProduct from "../controllers/products/createProduct.js";
import { upload } from "../middlewares/multer.middleware.js";
import createCategory from "../controllers/others/createCategory.js";
import createTag from "../controllers/others/createTag.js";
import updateProduct from "../controllers/products/updateProduct.js";
import deleteProduct from "../controllers/products/deleteProduct.js";
import getCategories from "../controllers/others/getCategories.js";
import getTags from "../controllers/others/getTags.js";
import { getOneProduct, getAllProducts } from '../controllers/products/getProduct.js'
import getPostedItems from "../controllers/products/getPostedItems.js";
import getBoughtItems from "../controllers/products/getBoughtItems.js";

const router = Router();


router.route('/create-product').post(
    verifyJWT,
    upload.array('images', 5),
    createProduct
);

router.route('/create-category').post(
    verifyJWT,
    upload.single("avatar"),
    createCategory
);

router.route('/create-tag').post(verifyJWT, createTag);

router.route('/update-product').put(
    verifyJWT,
    upload.array('images', 5),
    updateProduct
);

router.route('/delete-product').delete(verifyJWT, deleteProduct);
router.route('/get-posted-products').get(verifyJWT, getPostedItems);
router.route('/get-bought-products').get(verifyJWT, getBoughtItems);

router.route('/get-categories').get(verifyJWT,getCategories);
router.route('/get-tags').get(verifyJWT,getTags);
router.route('/get-products').get(verifyJWT,getAllProducts);
router.route('/get-product').get(verifyJWT,getOneProduct);

export default router