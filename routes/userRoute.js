const express = require('express');
const router = express.Router();
const middlewares = require('../middlewares/validateData');
const userController = require('../controllers/user-controller/userController');


router.post('/register', middlewares.checkRegister, userController.register);
router.post('/login', userController.login);
// 
router.get('/user', userController.getAllUser);
router.get('/user/:id', userController.getUser);
router.put('/user', userController.updateUser);
router.delete('/user/:id', userController.deleteUser);



module.exports = router;