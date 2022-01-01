const router = require('express').Router();

const paymentController = require('../controllers/payment');

router.post('/create-payment-intent', paymentController);

module.exports = router;
