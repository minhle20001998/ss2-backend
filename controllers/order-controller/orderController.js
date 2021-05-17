const cartSchema = require("../../models/cartSchema");
const mongoose = require("mongoose");
const orderSchema = require("../../models/orderSchema");
const productController = require('../admin-controller/productManage')
const cartController = require('../cart-controller/cartManagement')
const userController = require('../user-controller/userController')
class OrderController {
    async getOrder(req, res) {

    }

    async getCount(req, res) {
        try {
            const orderDB = await orderSchema.find({});
            res.json({
                order: orderDB.length
            })
        } catch (err) {
            res.json(err)

        }
    }

    async getAllOrders(req, res) {
        try {
            const orderDB = JSON.parse(JSON.stringify(await orderSchema.find({})))
            const orderUsername = [];
            const orderProducts = [];
            orderDB.map(order => {
                orderUsername.push(userController.getUserNameByID(order.userID))
                order.products.map(product => {
                    orderProducts.push(productController.getProductName(product.id))
                })
            })
            const result = await Promise.all(orderUsername);
            const resultProduct = await Promise.all(orderProducts);
            orderDB.map((order, index) => {
                orderDB[index].username = result[index]
                order.products.map((product, i) => {
                    orderDB[index].products[i].product_name = resultProduct.shift();
                })
            })
            res.json(orderDB)
        } catch (err) {
            res.json(err)

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
                cartController.removeAllProductCart(userID);
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
