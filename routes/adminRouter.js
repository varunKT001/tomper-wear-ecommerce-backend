const router = require('express').Router();

const adminController = require('../controllers/adminController');
const productController = require('../controllers/productController');

const auth = require('../middleware/Auth');

// register new admin
router
  .route('/register')
  .post(auth.checkUserAuthentication, adminController.registerAdmin);

// login admin
router.route('/login').post(adminController.loginAdmin);

// logout admin
router.route('/logout').get(adminController.logoutAdmin);

// get all admin details
router
  .route('/users')
  .get(auth.checkUserAuthentication, adminController.getAllAdminDetails);

// get single admin details
router
  .route('/users/:id')
  .get(auth.checkUserAuthentication, adminController.getSingleAdminDetails);

// create a new product
router
  .route('/product/new')
  .post(auth.checkUserAuthentication, productController.createProduct);

// send, update, delete a single product
router
  .route('/product/:id')
  .put(auth.checkUserAuthentication, productController.updateProduct)
  .delete(auth.checkUserAuthentication, productController.deleteProduct);

module.exports = router;
