const { register, login, verifyEmail, logOut } = require('../controller/UserController');

const router = require('express').Router();

router.post('/register', register);
router.get('/verifyuser/:token', verifyEmail)
router.post('/login', login)
router.get('/logout', logOut)

module.exports = router;
