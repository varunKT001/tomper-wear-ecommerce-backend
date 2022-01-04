const Admin = require('../models/adminModel');
const ErrorHandler = require('../utils/ErrorHandler');
const catchAsyncError = require('../middleware/CatchAsyncErrors');
const { sendToken } = require('../utils/jwt');

exports.registerAdmin = catchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return next(new ErrorHandler('Missing fields', 400));
  }
  const admin = await Admin.create({
    name,
    email,
    password,
  });
  sendToken(admin, 200, res);
});

exports.loginAdmin = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler('Missing fields', 400));
  }
  const admin = await Admin.findOne({ email }).select('+password');
  if (!admin) {
    return next(new ErrorHandler('Invalid email or password', 401));
  }
  const isPasswordMatched = await admin.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler('Invalid email or password', 401));
  }
  sendToken(admin, 200, res);
});

exports.logoutAdmin = catchAsyncError(async (req, res, next) => {
  res.cookie('token', null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: 'Logged out',
  });
});

exports.getAllAdminDetails = catchAsyncError(async (req, res, next) => {
  const admin = await Admin.find();
  const adminData = admin.map((item) => {
    return {
      id: item._id,
      name: item.name,
      email: item.email,
    };
  });
  res.status(200).json({
    success: true,
    data: adminData,
  });
});

exports.getSingleAdminDetails = catchAsyncError(async (req, res, next) => {
  if (!req.params.id) {
    return next(new ErrorHandler('User not found', 400));
  }
  const admin = await Admin.findById(req.params.id);
  if (!admin) {
    return next(new ErrorHandler('User not found', 200));
  }
  const adminData = {
    id: admin._id,
    name: admin.name,
    email: admin.email,
  };
  res.status(200).json({
    success: true,
    data: adminData,
  });
});
