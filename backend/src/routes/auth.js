const { Router } = require('express');
const { register } = require('../controllers/authController');
const { validateRegister } = require('../middleware/validate');

const router = Router();

router.post('/register', validateRegister, register);

module.exports = router;
