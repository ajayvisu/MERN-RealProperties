const mongoose = require("mongoose");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    UserName: { type: String, required: true, unique: false, sparse:true},
    EMail: { type: String, required: true, unique: true },
    MobileNo: { type: String, required: true },
    Password: { type: String, required: false, unique: false },
    // Role: { type: String, enum: ["admin", "user"], required: true },
    Verified: { type: Boolean, required: false, default: false },
    LoginStatus: { type: Boolean, required: false, default: false },
    // LoginType: { type: String, required: true },
    // OTP: { type: String, required: true },
    uuid: { type: String, required: false },
  },
  { timestamps: true }
);
userSchema.pre("save", function (next) {
  this.uuid =
    "USER-" + crypto.pseudoRandomBytes(5).toString("hex").toUpperCase();
  console.log(this.uuid);
  next();
});

module.exports = mongoose.model("user", userSchema);
