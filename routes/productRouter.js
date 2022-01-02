const router = require('express').Router();

const productController = require('../controllers/productController');

// GET ALL PRODUCTS
router.route('/').get(productController.getAllProducts);

// CREATE NEW PRODUCT
router.route('/new').post(productController.createProduct);

// GET, UPDATE, DELETE A EXISTING PRODUCT
router
  .route('/:id')
  .get(productController.getSingleProduct)
  .put(productController.updateProduct)
  .delete(productController.deleteProduct);

module.exports = router;
