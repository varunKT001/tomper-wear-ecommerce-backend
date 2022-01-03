const router = require('express').Router();

const productController = require('../controllers/productController');

// send all product detaisl
router.route('/').get(productController.getAllProducts);

// create a new product
router.route('/new').post(productController.createProduct);

// send, update, delete a single product
router
  .route('/:id')
  .get(productController.getSingleProduct)
  .put(productController.updateProduct)
  .delete(productController.deleteProduct);

module.exports = router;
