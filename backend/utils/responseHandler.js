module.exports = {
  success(res, data = null, message = "", status = 200) {
    return res.status(status).json({
      success: true,
      data,
      status,
      message,
    });
  },
  fail(res, message = "", error = null, status = 400) {
    return res.status(status).json({
      success: false,
      status,
      message: message ? message : "There was an error, Please try again later",
      errors: error ? [error] : null,
    });
  },
};
