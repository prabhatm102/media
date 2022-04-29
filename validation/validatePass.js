const Joi = require("joi");
module.exports.validatePass = (req, res, next) => {
  const schema = Joi.object({
    newPass: Joi.string().required().min(8).max(16),
    cnfPass: Joi.string().required().min(8).max(16),
    authToken: Joi.string(),
  });
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });
  next();
};
