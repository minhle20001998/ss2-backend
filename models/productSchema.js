const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ProductSchema = new Schema({
  _id: String,
  product_name: {
    type: String,
  },
  quantity: {
    type: Number,
  },
  colors: [{
    type: Object
  }],
  price: {
    type: Number,
  },
  description: {
    type: String
  },
  size: {
    type: Array
  },
  gender: {
    type: Boolean
  }

});

module.exports = mongoose.model("Products", ProductSchema);
