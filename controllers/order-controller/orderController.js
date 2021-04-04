const cartSchema = require("../../models/cartSchema");
const mongoose = require("mongoose");
const orderSchema = require("../../models/orderSchema");
const productController = require('../admin-controller/productManage')
class OrderController {
    async getOrder(req, res) {

    }

    async getAllOrders(req, res) {
        try {
            const orderDB = await orderSchema.find({});
            res.json(orderDB)
        } catch (err) {
            res.json({
                err: `${err}`
            })

        }
    }

    async createOrder(req, res) {
        const { userID } = req.body;
        const cart = await cartSchema.findOne({ userID: userID });
        if (cart && cart.products.length > 0) {
            try {
                const order = new orderSchema({
                    _id: new mongoose.Types.ObjectId().toHexString(),
                    userID: userID,
                    products: cart.products,
                    order_date: new Date(),
                    totalPayment: await productController.getProductsPrice(cart.products)
                });
                let saveOrder = await order.save();
                res.json(saveOrder);
            } catch (err) {
                res.status(500).send(err);
            }
        } else if (!cart) {
            res.json({
                err: "user not existed"
            })
        } else if (cart && cart.products.length === 0) {
            res.json({
                err: "no products in cart"
            })
        }
    }

    async deleteOrder(req, res) {
        try {
            const deleteOrder = await orderSchema.deleteOne({ _id: req.params.id });
            if (deleteOrder.n > 0)
                res.json(deleteOrder)
            else
                res.json({
                    err: "no cart found"
                })
        } catch (err) {
            res.json({
                err: `error ${err}`
            })
        }
    }
}

module.exports = new OrderController();
