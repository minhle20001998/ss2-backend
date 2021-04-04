const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const OrderSchema = new Schema({
    _id: String,
    userID: {
        type: String
    },
    products: [{
        type: Object
    }],
    order_date: {
        type: Date,
    },
    totalPayment: {
        type: Number,
    }
});

module.exports = mongoose.model("order", OrderSchema);

