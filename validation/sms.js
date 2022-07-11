const { totp } = require("otplib");
const fast2sms = require("fast-two-sms");
const smsApiKey = process.env.F2S_APIKEY;

require("dotenv").config();

function verifyotp(type) {
  if (type == "send") {
    const token = totp.generate(smsApiKey);
    console.log("token:" + token);
    return token;
  } else if (type == "resend") {
    const token = totp.generate(smsApiKey);
    console.log("resend token:" + token);
    return token;
  }
}
function verify() {
  const token = totp.generate(smsApiKey);
  console.log(token);
  const compare = totp.check(token, smsApiKey);
  console.log(compare);
}
verifyotp();
verify();

module.exports = { verifyotp, verify };
