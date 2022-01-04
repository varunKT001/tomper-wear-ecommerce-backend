const router = require('express').Router();

const productController = require('../controllers/productController');

// send all product detaisl
router.route('/').get(productController.getAllProducts);

// send a single product
router.route('/:id').get(productController.getSingleProduct);

module.exports = router;
