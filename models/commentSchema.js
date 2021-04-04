const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const commentSchema = new Schema({
    _id: String,
    productID: {
        type: String
    },
    userID: {
        type: String
    },
    username: {
        type: String
    },
    content: {
        type: String
    },
    date: {
        type: Date
    }
});

module.exports = mongoose.model("comments", commentSchema);

