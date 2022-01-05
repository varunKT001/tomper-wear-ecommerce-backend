const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const ErrorHandler = require('../utils/ErrorHandler');
const catchAsyncError = require('../middleware/CatchAsyncErrors');

// create new order
exports.createNewOrder = catchAsyncError(async (req, res, next) => {
  const {
    name,
    email,
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;
  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: { name, email },
  });
  res.status(200).json({
    success: true,
    data: order,
  });
});

// send single order
exports.getSingleOrder = catchAsyncError(async (req, res, next) => {
  if (!req.params.id) {
    return next(new ErrorHandler('Order not found', 400));
  }
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new ErrorHandler('Order not found', 200));
  }
  res.status(200).json({
    success: true,
    data: order,
  });
});

// send user orders
exports.getUserOrders = catchAsyncError(async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return next(new ErrorHandler('Order not found', 400));
  }
  const order = await Order.find({ 'user.email': email });
  if (!order) {
    return next(new ErrorHandler('Order not found', 200));
  }
  res.status(200).json({
    success: true,
    data: order,
  });
});

// send all orders
exports.getAllOrders = catchAsyncError(async (req, res, next) => {
  const orders = await Order.find();
  res.status(200).json({
    success: true,
    data: orders,
  });
});

// update order status
exports.updateOrderStatus = catchAsyncError(async (req, res, next) => {
  if (!req.params.id) {
    return next(new ErrorHandler('Order not found', 400));
  }
  if (!req.body.status) {
    return next(new ErrorHandler('Invalid request', 400));
  }
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new ErrorHandler('Order not found', 200));
  }
  if (order.orderStatus === 'delivered') {
    return next(new ErrorHandler('You have already delivered this order', 400));
  }
  if (req.body.status === 'confirmed') {
    order.orderItems.forEach(async (ord) => {
      await updateStock(ord.product, ord.quantity);
    });
  }
  order.orderStatus = req.body.status;
  if (req.body.status === 'delivered') {
    order.deliveredAt = Date.now();
  }
  await order.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
    data: order,
  });
});

// delete order
exports.deleteOrder = catchAsyncError(async (req, res, next) => {
  if (!req.params.id) {
    return next(new ErrorHandler('Order not found', 400));
  }
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new ErrorHandler('Order not found', 200));
  }
  await order.remove();
  res.status(200).json({
    success: true,
    message: 'Order deleted',
  });
});

const updateStock = async (id, quantity) => {
  const product = await Product.findById(id);
  product.stock -= quantity;
  await product.save({ validateBeforeSave: false });
};
