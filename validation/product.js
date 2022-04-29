const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

module.exports.validateProduct = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().required().min(1).max(80),
    price: Joi.number().required().min(0).max(10000000),
    imageUrl: Joi.string().required().min(5),
    category: Joi.objectId().required(),
  });
  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).send({ message: error.details[0].message });
  }

  next();
};

module.exports.validateUpdateProduct = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().min(1).max(80),
    price: Joi.number().min(0).max(10000000),
    imageUrl: Joi.string().min(5),
    category: Joi.objectId(),
  }).or("title", "price", "imageUrl", "category");
  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).send({ message: error.details[0].message });
  }

  next();
};
