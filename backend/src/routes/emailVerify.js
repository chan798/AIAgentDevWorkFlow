const { Router } = require('express');
const { verifyEmail } = require('../controllers/emailVerifyController');

const router = Router();

router.get('/verify-email', verifyEmail);

module.exports = router;
