const Admin = require('../models/adminModel');
const jwt = require('jsonwebtoken');
const ErrorHandler = require('../utils/ErrorHandler');
const catchAsyncError = require('../middleware/CatchAsyncErrors');
const { sendToken } = require('../utils/jwt');

exports.registerAdmin = catchAsyncError(async (req, res, next) => {
  const { name, email, password, privilege } = req.body;
  if (!name || !email || !password) {
    return next(new ErrorHandler('Missing fields', 400));
  }
  const admin = await Admin.create({
    name,
    email,
    privilege,
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

exports.getAllAdminDetails = catchAsyncError(async (req, res, next) => {
  const admin = await Admin.find();
  const adminData = admin.map((item) => {
    return {
      id: item._id,
      name: item.name,
      email: item.email,
      privilege: item.privilege,
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

exports.sendCurrentUser = catchAsyncError(async (req, res, next) => {
  const { token } = req.body;
  if (!token) {
    return next(new ErrorHandler('User not found', 400));
  }
  const decodedData = await jwt.verify(token, process.env.JWT_SECRET);
  const admin = await Admin.findById(decodedData.id);
  if (!admin) {
    new ErrorHandler('User not found', 401);
  }
  sendToken(admin, 200, res);
});

exports.updateAdminPrivilege = catchAsyncError(async (req, res, next) => {
  const { privilege } = req.body;
  if (!req.params.id) {
    return next(new ErrorHandler('User not found', 400));
  }
  if (!privilege) {
    return next(new ErrorHandler('Invalid: no data provided', 400));
  }
  if (!['super', 'moderate', 'low'].includes(privilege)) {
    return next(new ErrorHandler('Invalid: data invalid', 400));
  }
  const admin = await Admin.findById(req.params.id);
  if (!admin) {
    return next(new ErrorHandler('User not found', 200));
  }
  if (admin.email === req.user.email) {
    return next(new ErrorHandler('Cannot change privilege for self', 400));
  }
  admin.privilege = privilege;
  await admin.save();
  res.status(200).json({
    success: true,
    data: admin,
  });
});

exports.deleteAdmin = catchAsyncError(async (req, res, next) => {
  if (!req.params.id) {
    return next(new ErrorHandler('User not found', 400));
  }
  const admin = await Admin.findById(req.params.id);
  if (!admin) {
    return next(new ErrorHandler('User not found', 200));
  }
  if (admin.email === req.user.email) {
    return next(new ErrorHandler('Cannot delete self', 400));
  }
  await admin.remove();
  res.status(200).json({
    success: true,
    message: 'Admin deleted',
  });
});
