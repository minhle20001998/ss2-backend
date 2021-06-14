const express = require('express');
const router = express.Router();
const middlewares = require('../middlewares/validateData');
const userController = require('../controllers/user-controller/userController');


router.post('/register', middlewares.checkRegister, userController.register);
router.post('/login', userController.login);
// router.post('/login/admin', userController.login);

// 
router.get('/user/count', userController.getCountUser);
router.get('/user', userController.getAllUser);
router.get('/user/:id', userController.getUser);
router.get('/user/orders/:id', userController.getUserOrder);
router.put('/user', userController.updateUser);
router.put('/user/:id', userController.updateUserInfo);

router.delete('/user/:id', userController.deleteUser);



module.exports = router;