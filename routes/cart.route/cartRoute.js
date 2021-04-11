const express = require("express");
const router = express.Router();
const cartController = require('../../controllers/cart-controller/cartManagement');
const checkCustomerAuthority = require('../../middlewares/checkAuthority');
const checkIfCartExist = require('../../middlewares/validateData');
/**
 * @swagger
 * tags:
 *      name: Carts
 *      description: API to manage carts
 */
/**
 * @swagger
 * path:
 * /cart:
 *  get:
 *      tags: [Carts]
 *      description: Use to get all carts
 *      responses: 
 *          '200':
 *              description: A successful response
 *          '401':
 *              description: Unauthorized
 */
router.get('/', cartController.getAllCart);
router.get('/:id', cartController.getCart);
router.post('/', checkIfCartExist.checkIfCartExist, cartController.createCart);
router.put('/user', cartController.updateCartByUserID);
router.put('/', cartController.updateCart);

router.delete('/:id', cartController.removeCartForRoute);




module.exports = router;


