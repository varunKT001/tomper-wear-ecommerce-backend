const router = require('express').Router();

const paymentController = require('../controllers/paymentController');

router.post('/create-payment-intent', paymentController);

module.exports = router;
