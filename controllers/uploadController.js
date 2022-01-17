const ErrorHandler = require('../utils/ErrorHandler');
const catchAsyncError = require('../middleware/CatchAsyncErrors');
const cloudinary = require('../config/cloudinary');

exports.uploadImage = catchAsyncError(async (req, res, next) => {
  const { image } = req.body;
  if (!image) {
    return next(new ErrorHandler('Invalid request', 400));
  }
  const { public_id, url } = await cloudinary.uploader.upload(image, {
    folder: 'profile-images',
  });
  res.status(200).json({
    success: true,
    data: {
      public_id,
      url,
    },
  });
});
