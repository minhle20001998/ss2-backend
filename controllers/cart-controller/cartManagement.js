const cartSchema = require("../../models/cartSchema");
const mongoose = require("mongoose");
const productSchema = require("../../models/productSchema");
class cartManagement {
    constructor() {
        this.validateProductIDs = this.validateProductIDs.bind(this);
        this.createCart = this.createCart.bind(this);
        this.updateCart = this.updateCart.bind(this);
        this.updateCartByUserID = this.updateCartByUserID.bind(this);
        this.removeCartForRoute = this.removeCartForRoute.bind(this);
    }

    async getCart(req, res) {
        try {
            const cart = await cartSchema.findOne({ _id: req.params.id });
            res.json(cart);
        } catch (err) {
            res.json({
                err: `${err}`
            })
        }
    }

    async getAllCart(req, res) {
        try {
            const allCarts = await cartSchema.find({});
            res.json(allCarts);
        } catch (err) {
            res.json({
                err: `${err}`
            })

        }
    }

    async createCart(req, res) {
        try {
            const { userID } = req.body;
            const cart = new cartSchema({
                _id: new mongoose.Types.ObjectId().toHexString(),
                userID: userID,
            });
            let saveCart = await cart.save();
            if (res) {
                res.json(saveCart);
            }
        }
        catch (err) {
            if (res) {
                res.status(500).send(err);
            }
        }
    }

    async updateCart(req, res) {
        try {
            const { userID, products } = req.body;
            const validateProduct = await this.validateProductIDs(products);
            if (validateProduct.length > 0) {
                const updatedCart = await cartSchema.findOneAndUpdate({ _id: req.body._id }, {
                    userID: userID,
                    products: this.toProducts(products, validateProduct)
                }, {
                    new: true
                });
                res.json(updatedCart)
            } else {
                res.json({
                    err: "Product out of stock"
                })
            }
        } catch (err) {
            if (res) {
                res.status(500).send(err);
            }
        }
    }

    async updateCartByUserID(req, res) {
        try {
            const { userID, products } = req.body;
            const validateProduct = await this.validateProductIDs(products);
            if (validateProduct.length > 0) {
                const updatedCart = await cartSchema.findOneAndUpdate({ userID: userID }, {
                    products: this.toProducts(products, validateProduct)
                }, {
                    new: true
                });
                res.json(updatedCart)
            } else {
                res.json({
                    err: "Product out of stock"
                })
            }
        } catch (err) {
            if (res) {
                res.status(500).send(err);
            }
        }
    }

    async deleteCart(req, res) {
        try {
            const deleteCart = await cartSchema.deleteOne({ _id: req.params.id });
            if (deleteCart.n > 0)
                res.json(deleteCart)
            else
                res.json({
                    err: "no cart found"
                })
        } catch (err) {
            if (res) {
                res.status(500).send(err);
            }
        }
    }

    async removeCartForRoute(req, res) {
        const { id } = req.params;
        const result = await this.removeProductCart(id);
        if (result) {
            res.json(result)
        } else {
            res.json('err')
        }
    }

    async removeProductCart(id) {
        try {
            const cart = await cartSchema.findOneAndUpdate({ userID: id }, {
                products: []
            }, {
                new: true
            })
            return cart;
        } catch (err) {
            return null;
        }
    }

    validateProductIDs(products) {
        console.log(products)
        const results = [];
        return Promise.all(products.map(p => {
            const queryResult = productSchema.findOne({ _id: p.id }).where('quantity').gt(p.quantity);
            return queryResult
        })).then((productDB) => {
            productDB.forEach(product => {
                if (product !== null && product.quantity > 0) {
                    results.push(product._id)
                }
            });
            return results
        })

    }

    toProducts(product, ids) {
        return product.filter(value => ids.includes(value.id));
    }
}

module.exports = new cartManagement();
