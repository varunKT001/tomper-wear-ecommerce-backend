const Product = require('../models/productModel');
const ErrorHandler = require('../utils/ErrorHandler');
const catchAsyncError = require('../middleware/CatchAsyncErrors');
const cloudinary = require('../config/cloudinary');

// create a new product
exports.createProduct = catchAsyncError(async (req, res, next) => {
  req.body.admin = req.user.id;
  const product = await Product.create(req.body);
  res.status(200).json({
    success: true,
    data: product,
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
  for (let i = 0; i < product.images.length; i++) {
    await cloudinary.uploader.destroy(product.images[i].public_id);
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
      stock,
      shipping,
      featured,
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
      stock,
      shipping,
      featured,
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

// review a product
exports.createProductReview = catchAsyncError(async (req, res, next) => {
  const { rating, comment, productId, name, email } = req.body;
  if (!rating || !comment || !productId || !name || !email) {
    return next(new ErrorHandler('Request invalid', 400));
  }
  // creating a review
  const review = {
    name,
    email,
    rating: Number(rating),
    comment,
  };
  const product = await Product.findById(productId);
  // check if the user already reviewed
  const isReviewed = product.reviews.some((rev) => rev.email === email);
  // user already review: update the review
  // user gives new review: add new review and update the number of reviews
  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.email === email) {
        rev.rating = rating;
        rev.comment = comment;
      }
    });
  } else {
    product.reviews.push(review);
    product.numberOfReviews = product.reviews.length;
  }
  // update product rating
  let avg = 0;
  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });
  avg = avg / product.reviews.length;
  product.rating = avg;
  // save the product
  await product.save({ validateBeforeSave: false });
  // send success response
  res.status(200).json({
    success: true,
    message: 'Product review created',
  });
});

// send all product reviews
exports.getAllReviews = catchAsyncError(async (req, res, next) => {
  if (!req.params.id) {
    return next(new ErrorHandler('Product not found', 400));
  }
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler('Product not found', 200));
  }
  const reviews = product.reviews;
  res.status(200).json({
    success: true,
    data: reviews,
  });
});

// delete product review
exports.deleteReview = catchAsyncError(async (req, res, next) => {
  if (!req.params.id) {
    return next(new ErrorHandler('Product not found', 400));
  }
  const { reviewId } = req.body;
  if (!reviewId) {
    return next(new ErrorHandler('Review not found', 400));
  }
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler('Product not found', 200));
  }
  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== reviewId.toString()
  );
  let avg = 0;
  reviews.forEach((rev) => {
    avg += rev.rating;
  });
  avg = avg / reviews.length;
  const rating = avg || 0;
  const numberOfReviews = reviews.length;
  await Product.findByIdAndUpdate(
    req.params.id,
    {
      rating,
      numberOfReviews,
      reviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: true,
    }
  );
  res.status(200).json({
    success: true,
    message: 'Review deleted',
  });
});

// upload product images
exports.uploadImages = catchAsyncError(async (req, res, next) => {
  const { images } = req.body;
  let promises = [];
  images.forEach((image) => {
    promises.push(
      cloudinary.uploader.upload(image, {
        folder: 'tomper-wear',
      })
    );
  });
  const response = await Promise.all(promises);
  const data = response.map((item) => {
    const { public_id, secure_url: url } = item;
    return { public_id, url };
  });
  res.status(200).json({
    success: true,
    data,
  });
});
