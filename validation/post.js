const Joi = require("joi");
const fs = require("fs");
const path = require("path");

module.exports.validate = (req, res, next) => {
  const schema = Joi.object({
    message: Joi.string().allow(""),
    postFile: Joi.array(),
  });
  const { error } = schema.validate(req.body);

  if (error) {
    if (req.file) {
      fs.unlinkSync(
        path.join(__dirname, "../public/posts/") + req.file.filename
      );
    }
    return res.status(400).send({ message: error.details[0].message });
  }

  next();
};
