const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
module.exports.validateLike = (req, res, next) => {
  const schema = Joi.object({
    post: Joi.objectId().required(),
  });
  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).send({ message: error.details[0].message });
  }

  next();
};
