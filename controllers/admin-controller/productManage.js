const productSchema = require("../../models/productSchema");
const mongoose = require("mongoose");
const multer = require('multer');

class manageProductController {
  //get specifict products
  async getProduct(req, res) {
    const { id } = req.params;
    const productDB = await productSchema.find({ _id: id });
    try {
      res.json({
        products: productDB
      })
    } catch (err) {
      res.json({
        err: `${err}`
      })
    }
    return productDB;
  }

  //get all products
  async getProducts(req, res) {
    try {
      const productDB = await productSchema.find({});
      res.json(productDB)
    } catch (err) {
      res.json({
        err: `${err}`
      })

    }
  }


  //create a product
  createProduct(req, res) {
    const { colors, product_name, quantity, price, description, size } = req.body;
    const color_and_images = [];
    if (req.files) {
      req.files.map((image, index) => {
        color_and_images.push({ image: image.path, color: colors[index] })
      })
    }
    const product = new productSchema({
      _id: new mongoose.Types.ObjectId().toHexString(),
      product_name: req.body.product_name,
      quantity: req.body.quantity,
      colors: color_and_images,
      price: req.body.price,
      description: req.body.description,
      size: req.body.size
    });
    product.save().then((result) => {
      res.json(result)
    }).catch((err) => {
      res.json({
        err: `${Object.keys(err.keyPattern)[0]}`,
      })
    });
  }
  //update a product
  async updateProduct(req, res) {
    try {
      const updatedProduct = await productSchema.findOneAndUpdate({ _id: req.body._id }, req.body, {
        new: true
      })
      res.json(updatedProduct)
    } catch (err) {
      res.json({
        err: `error ${err}`
      })
    }
  }
  //delete product
  async deleteProduct(req, res) {
    try {
      const deleteProduct = await productSchema.deleteOne({ _id: req.params.id });
      if (deleteProduct.n > 0)
        res.json(deleteProduct)
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

  async reduceQuantity(productID, quantity) {

  }

  async getProductsPrice(products) {
    // [{
    //   productID
    //   quantity
    // },]
    let totalPrice = 0;
    const result = await Promise.all(products.map(async (product) => {
      const productDB = await productSchema.findOne({ _id: product.id });
      return productDB;
    }))
    result.map((product) => {
      const filter = products.filter(p => p.id === product._id)[0];
      totalPrice += product.price * filter.quantity
    })
    console.log("total", totalPrice)
    return totalPrice;
  }
}

module.exports = new manageProductController();
