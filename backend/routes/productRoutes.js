const express=require('express');
const router=express.Router();
const {
    getAllProducts, createProduct, getProductDetails, updateProduct, deleteProduct,
    getAdminProducts
}=require('../controllers/productController');
const {isAuthenticatedUser, authorizeRoles}=require("../middleware/auth");

router.get("/products", getAllProducts);
router.get("/product/:id", getProductDetails);
router.get("/admin/products", isAuthenticatedUser, authorizeRoles("admin"), getAdminProducts);
router.post("/admin/product/new", isAuthenticatedUser, authorizeRoles("admin"), createProduct);
router.put("/admin/product/:id", isAuthenticatedUser, authorizeRoles("admin"), updateProduct);
router.delete("/admin/product/:id", isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);
module.exports=router;
