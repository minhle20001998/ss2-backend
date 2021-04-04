const express = require("express");
const router = express.Router();
const orderController = require('../../controllers/order-controller/orderController');
const checkCustomerAuthority = require('../../middlewares/checkAuthority');
const checkIfCartExist = require('../../middlewares/validateData');

router.get('/', orderController.getAllOrders);
// router.get('/:id', cartController.getCart);
router.post('/', orderController.createOrder);
// router.put('/', cartController.updateCart);
router.delete('/:id', orderController.deleteOrder);




module.exports = router;


