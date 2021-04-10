const express = require("express");
const router = express.Router();
const productManageController = require("../../controllers/admin-controller/productManage");
const checkAdminAuthority = require("../../middlewares/checkAuthority");
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + '-' + file.originalname)
    }
});

const fileFilter = (req, file, cb) => {
    //reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(new Error("wrong file type, jpeg and png only"), false);
    }
    // if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' ) {
    // }
    // cb(new Error("wrong file type, jpeg and png only"), false);
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 3
    },
    fileFilter: fileFilter
});

/**
 * @swagger
 * tags:
 *      name: Products
 *      description: API to manage products
 */

//middleware check if authority is admin
/**
 * @swagger
 * path:
 * /product:
 *  get:
 *      tags: [Products]
 *      description: Use to get all products
 *      responses: 
 *          '200':
 *              description: A successful response
 *          '401':
 *              description: Unauthorized
 */
router.get("/", productManageController.getProducts);
/**
 * @swagger
 * /product/:id:
 *  get:
 *      tags: [Products]
 *      description: Use to get a specifict product
 *      responses: 
 *          '200':
 *              description: A successful response
 *          '401':
 *              description: Unauthorized
 */
router.get("/:id", productManageController.getProduct);
/**
 * @swagger
 * /product:
 *  post:
 *      tags: [Products]
 *      description: Use to create a product
 *      parameters:
 *       - name: product_name
 *         description: product name
 *         in: formData
 *         required: true
 *         type: String
 *       - name: quantity
 *         description: product quantity
 *         in: formData
 *         required: true
 *         type: Integer
 *       - name: colors
 *         description: product colors
 *         in: formData
 *         required: true
 *         type: Array
 *       - name: files
 *         description: product images
 *         in: formData
 *         required: true
 *         type: File
 *       - name: description
 *         description: product description
 *         in: formData
 *         required: true
 *         type: String
 *       - name: size
 *         description: product size
 *         in: formData
 *         required: true
 *         type: Integer    
 *      responses: 
 *          '200':
 *              description: A successful response
 *          '401':
 *              description: Unauthorized
 */
router.post("/", upload.array('productImage'), productManageController.createProduct);
/**
 * @swagger
 * /product:
 *  put:
 *      tags: [Products]
 *      description: Use to update a product
 *      parameters:
 *       - name: product_name
 *         description: product name
 *         in: formData
 *         required: true
 *         type: String
 *       - name: quantity
 *         description: product quantity
 *         in: formData
 *         required: true
 *         type: Integer
 *       - name: colors
 *         description: [{image: String, color: String}]
 *         in: formData
 *         required: true
 *         type: Object
 *       - name: description
 *         description: product description
 *         in: formData
 *         required: true
 *         type: String
 *       - name: size
 *         description: product size
 *         in: formData
 *         required: true
 *         type: Integer  
 *      responses: 
 *          '200':
 *              description: A successful response
 *          '401':
 *              description: Unauthorized
 */
router.put("/", productManageController.updateProduct);
/**
 * @swagger
 * /product/:id:
 *  delete:
 *      tags: [Products]
 *      description: Use to delete a product
 *      responses: 
 *          '200':
 *              description: A successful response
 *          '401':
 *              description: Unauthorized
 */
router.delete("/:id", productManageController.deleteProduct);

module.exports = router;
