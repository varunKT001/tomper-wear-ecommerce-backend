const Product = require('../models/productModel');
const ErrorHandler = require('../utils/ErrorHandler');
const catchAsyncError = require('../middleware/CatchAsyncErrors');

// create a new product
exports.createProduct = catchAsyncError(async (req, res, next) => {
  const product = await Product.create(req.body);
  res.status(200).json({
    success: true,
    product,
  });
});

// update an existing product
exports.updateProduct = catchAsyncError(async (req, res, next) => {
  if (!req.params.id) {
    return next(new ErrorHandler('Product Not Found', 400));
  }
  let product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler('Product Not Found', 200));
  }
  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    product,
  });
});

// delete an existing product
exports.deleteProduct = catchAsyncError(async (req, res, next) => {
  if (!req.params.id) {
    return next(new ErrorHandler('Product Not Found', 400));
  }
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler('Product Not Found', 200));
  }
  await product.remove();
  res.status(200).json({
    success: true,
    message: 'Product deleted',
  });
});

// send all product details
exports.getAllProducts = catchAsyncError(async (req, res) => {
  const products = await Product.find();
  const data = products.map((item, index) => {
    const {
      _id: id,
      name,
      price,
      images,
      colors,
      company,
      description,
      category,
      shipping,
    } = item;
    const newItem = {
      id,
      name,
      price,
      image: images[0].url,
      colors,
      company,
      description,
      category,
      shipping,
    };
    return newItem;
  });
  res.status(200).json({
    success: true,
    data,
  });
});

// send only a single product detaisl
exports.getSingleProduct = catchAsyncError(async (req, res, next) => {
  if (!req.params.id) {
    return next(new ErrorHandler('Product Not Found', 400));
  }
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler('Product Not Found', 200));
  }
  res.status(200).json({
    success: true,
    data: product,
  });
});
