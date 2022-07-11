const mongoose = require("mongoose");
const crypto = require("crypto");

const propertySchema = new mongoose.Schema(
  {
    // Images: {type: String, required: true},
    uuid: { type: String, required: false },
    Type: { type: String, required: true },
    Details: { type: String, required: true },
    Price: { type: String, required: true },
    Category: { type: String, required: true },
    UserUuid: { type: String, required: false },
  },
  { timestamps: true }
);

propertySchema.pre("save", function (next) {
  this.uuid =
    "PROP-" + crypto.pseudoRandomBytes(5).toString("hex").toUpperCase();
  console.log(this.uuid);
  next();
});

module.exports = mongoose.model("property", propertySchema);
