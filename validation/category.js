const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

module.exports.validateCategory = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required().min(1).max(80),
  });
  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).send({ message: error.details[0].message });
  }

  next();
};
