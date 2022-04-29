const Joi = require("joi");
module.exports.validateEmail = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().required().max(40),
  });
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });
  next();
};
