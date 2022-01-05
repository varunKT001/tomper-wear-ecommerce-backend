const router = require('express').Router();

const orderController = require('../controllers/orderController');

// create new order
router.route('/new').post(orderController.createNewOrder);

// send user orders
router.route('/').get(orderController.getUserOrders);

// send single order
router.route('/:id').get(orderController.getSingleOrder);

module.exports = router;
