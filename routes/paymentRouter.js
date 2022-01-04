const router = require('express').Router();

const paymentController = require('../controllers/paymentController');

// creating client secret
router.post('/create-payment-intent', paymentController);

module.exports = router;
