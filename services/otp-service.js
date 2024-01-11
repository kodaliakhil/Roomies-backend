const crypto = require("crypto");
const hashService = require("./hash-service");

class OtpService {
  generateOtp() {
    const otp = crypto.randomInt(1000, 9999);
    return otp;
  }
  sendBySms() {}
  verifyOtp(hashOtp, data) {
    let computedHash = hashService.hashOtp(data);
    // console.log("hashOtp", hashOtp);
    // console.log("computedHash", computedHash);
    return computedHash === hashOtp;
  }
}
module.exports = new OtpService();
