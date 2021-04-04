const express = require("express");
const router = express.Router();
const commentController = require('../../controllers/comment-controller/commentController');
const {checkIfProduct} = require('../../middlewares/validateData');

router.get('/:id', commentController.getAllComments);
router.post('/', checkIfProduct, commentController.createComment);
router.put('/', commentController.updateComment);
router.delete('/:id', commentController.deleteComment);

module.exports = router;


