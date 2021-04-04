const express = require('express');
const router = express.Router();
const middlewares = require('../middlewares/validateData');
const userController = require('../controllers/user-controller/userController');

router.get('/', (req, res) => {
    res.sendFile('views/test.html', { root: './' })
});
router.post('/register', middlewares.checkRegister, userController.register);
router.post('/login', userController.login);

module.exports = router;