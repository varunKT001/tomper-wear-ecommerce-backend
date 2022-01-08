// create jwt token and save as a cookie
exports.sendToken = (admin, statusCode, res) => {
  const token = admin.getJwtToken();
  res.status(statusCode).json({
    success: true,
    data: {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      privilege: admin.privilege,
    },
    token: token,
  });
};
