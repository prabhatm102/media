const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

module.exports.validate = (req, res, next) => {
  const schema = Joi.object({
    message: Joi.string().required().min(1).max(255),
    receiver: Joi.objectId().required(),
  });
  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).send({ message: error.details[0].message });
  }

  next();
};

module.exports.validateWallpaperUpdate = (req, res, next) => {
  const schema = Joi.object({
    wallpaper: Joi.array().required(),
  });
  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).send({ message: error.details[0].message });
  }

  next();
};
