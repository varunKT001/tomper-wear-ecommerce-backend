const Product = require('../models/productModel');

// CREATE PRODUCT
exports.createProduct = async (req, res, next) => {
  const product = await Product.create(req.body);
  res.status(200).json({
    success: true,
    product,
  });
};

// UPDATE EXISTING PRODUCT
exports.updateProduct = async (req, res, next) => {
  if (!req.params.id) {
    return res.status(400).json({
      success: false,
      message: 'Product not found',
    });
  }
  let product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(200).json({
      success: false,
      message: 'Product not found',
    });
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
};

// DELETE EXISTING PRODUCT
exports.deleteProduct = async (req, res, next) => {
  if (!req.params.id) {
    return res.status(400).json({
      success: false,
      message: 'Product not found',
    });
  }
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(200).json({
      success: false,
      message: 'Product not found',
    });
  }
  await product.remove();
  res.status(200).json({
    success: true,
    message: 'Product deleted',
  });
};

// GET ALL PRODUCTS
exports.getAllProducts = async (req, res) => {
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
};

// GET SINGLE PRODUCT
exports.getSingleProduct = async (req, res, next) => {
  if (!req.params.id) {
    return res.status(400).json({
      success: false,
      message: 'Product not found',
    });
  }
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(200).json({
      success: false,
      message: 'Product not found',
    });
  }
  res.status(200).json({
    success: true,
    data: product,
  });
};
