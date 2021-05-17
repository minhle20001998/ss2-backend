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

  returnImage(req, res) {
    if (req.files) {
      const files = []
      req.files.map(file => {
        files.push(file.path)
      })
      res.json(files)
    }
  }

  //create a product
  createProduct(req, res) {
    const { colors, product_name, quantity, price, description, size, gender } = req.body;
    const color_and_images = [];
    console.log(colors)
    if (req.files) {
      req.files.map((image, index) => {
        color_and_images.push({ image: image.path, color: (typeof colors === "string") ? colors : colors[index] })
      })
    }
    const product = new productSchema({
      _id: new mongoose.Types.ObjectId().toHexString(),
      product_name: product_name,
      quantity: quantity,
      colors: color_and_images,
      price: price,
      description: description,
      size: size,
      gender: gender
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
    let { colors } = req.body;
    let data = req.body
    data.colors = colors.filter(el => el.color.length > 0)
    try {
      const updatedProduct = await productSchema.findOneAndUpdate({ _id: req.body._id }, data, {
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

  async getProductName(id) {
    const productDB = await productSchema.findOne({ _id: id });
    if (productDB) {
      return productDB.product_name;
    } else {
      return null;
    }
  }

  async getCount(req, res) {
    const productDB = await productSchema.find({});
    res.json({
      product: productDB.length
    })
  }
}

module.exports = new manageProductController();
