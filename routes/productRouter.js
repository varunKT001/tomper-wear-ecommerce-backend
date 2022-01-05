const router = require('express').Router();

const productController = require('../controllers/productController');

// send all product detaisl
router.route('/').get(productController.getAllProducts);

// send a single product
router.route('/:id').get(productController.getSingleProduct);

// create product review
router.route('/reviews').post(productController.createProductReview);

// send all product reviews
router.route('/reviews/:id').get(productController.getAllReviews);

module.exports = router;
