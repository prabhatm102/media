const mongoose = require("mongoose");

module.exports.validateObjectId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(403).send("Invalid Id Format");
  next();
};
