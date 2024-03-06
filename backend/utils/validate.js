const responseHandler = require("./responseHandler");

const validate = (schema) => async (req, res, next) => {
  const resource = req.body;
  try {
    await schema.validate(resource);
    next();
  } catch (e) {
    return responseHandler.fail(
      res,
      e.errors.join(", "),
      e
    );
  }
};

module.exports = validate;
