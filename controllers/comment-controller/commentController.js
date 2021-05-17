const mongoose = require("mongoose");
const commentSchema = require("../../models/commentSchema");
const userController = require('../user-controller/userController')
class OrderController {
    async getCount(req, res) {
        try {
            const comments = await commentSchema.find({});
            res.json({
                comment: comments.length
            })
        } catch (err) {
            res.status(500).send(err);
        }
    }

    async getAllComments(req, res) {
        const { id } = req.params;
        try {
            const comments = await commentSchema.find({ productID: id });
            res.json(comments)
        } catch (err) {
            res.status(500).send(err);
        }
    }

    // create comment 
    async createComment(req, res) {
        console.log(req.body)
        const { userID, productID, content } = req.body;
        // get username;
        const username = await userController.getUserNameByID(userID);
        if (username) {
            try {
                const comment = new commentSchema({
                    _id: new mongoose.Types.ObjectId().toHexString(),
                    productID: productID,
                    userID: userID,
                    username: username,
                    content: content,
                    date: new Date()
                })
                const commentSave = await comment.save();
                res.json(commentSave);
            } catch (err) {
                res.status(500).send(err);
            }
        }else{
            res.status(404)
        }
    }

    async updateComment(req, res) {
        const { id, content } = req.body;
        try {
            const updatedComment = await commentSchema.findOneAndUpdate({ _id: id }, {
                content: content
            }, {
                new: true
            });
            if (updatedComment) {
                res.json(updatedComment)
            } else {
                res.json({
                    err: "comment not found"
                })
            }
        } catch (err) {
            res.status(500).send(err);
        }
    }

    async deleteComment(req, res) {
        const { id } = req.params;
        try {
            const comment = await commentSchema.deleteOne({ _id: id });
            if (comment.n > 0)
                res.json(comment)
            else
                res.json({
                    err: "no cart found"
                })
        } catch (err) {
            res.status(500).send(err);
        }
    }

}

module.exports = new OrderController();

