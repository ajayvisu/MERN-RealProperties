const mongoose = require("mongoose");
const crypto = require("crypto");

const categorySchema = new mongoose.Schema(
  {
    uuid: { type: String, required: false },
    CategoryName: { type: String, required: true, trim: true },
    UserUuid: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

// UUID GENERATION
categorySchema.pre("save", function (next) {
  this.uuid =
    "CATE-" + crypto.pseudoRandomBytes(6).toString("hex").toUpperCase();
  console.log(this.uuid);
  next();
});

module.exports = mongoose.model("category", categorySchema);
