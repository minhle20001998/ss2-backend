const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const CartSchema = new Schema({
    _id: String,
    userID: {
        type: String
    },
    products: [{
        type: Object
    }]
});

module.exports = mongoose.model("cart", CartSchema);

