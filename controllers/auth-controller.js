const otpService = require("../services/otp-service");
const hashService = require("../services/hash-service");
const userService = require("../services/user-service");
const tokenService = require("../services/token-service");
const UserDto = require("../dtos/user-dto");

class AuthController {
  async sendOtp(req, res) {
    const { phone } = req.body;
    if (!phone) {
      res.status(400).json({ message: "Phone field is required!" });
      return;
    }
    const otp = otpService.generateOtp();
    const ttl = 1000 * 60 * 2; //2 mins time to leave
    const expires = Date.now() + ttl;
    const data = `${phone}.${otp}.${expires}`;
    const hash = hashService.hashOtp(data);
    try {
      res.json({ otp: otp, hash: `${hash}.${expires}`, phone }); //remove otp from the response when deployed
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "message sending failed" });
    }
  }
  ///////////////////////////////////////////////////////////////////////////////////
  async verifyOtp(req, res) {
    const { otp, phone, hash } = req.body;
    if (!otp || !phone || !hash) {
      res.status(400).json({ message: "All fields are required!" });
      return;
    }
    const [hashOtp, expires] = hash.split(".");
    if (Date.now() > +expires) {
      res.status(400).json({ message: "OTP expired!" });
      return;
    }
    const data = `${phone}.${otp}.${expires}`;
    const isValid = otpService.verifyOtp(hashOtp, data);
    if (!isValid) {
      res.status(400).json({ message: "Invalid OTP" });
      return;
    }
    let user;
    try {
      user = await userService.findUser({ phone });

      if (!user) {
        user = await userService.createUser({ phone });
      }
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "DB Error" });
      return;
    }

    //Token
    const { accessToken, refreshToken } = tokenService.generateTokens({ _id: user._id, activated: false });

    await tokenService.storeRefreshToken(refreshToken, user._id);
    res.cookie("refreshToken", refreshToken, { maxAge: 1000 * 60 * 60 * 24 * 30, httpOnly: true });
    res.cookie("accessToken", accessToken, { maxAge: 1000 * 60 * 60 * 24 * 30, httpOnly: true });
    const userDto = new UserDto(user);
    res.json({ user: userDto, auth: true });
  }
  //////////////////////////////////////////////////////////////////////////////////
  async refresh(req, res) {
    //get refresh token from cookie
    const { refreshToken: refreshTokenFromCookie } = req.cookies;
    //check if token is valid
    let userData;
    try {
      userData = await tokenService.verifyRefreshToken(refreshTokenFromCookie);
    } catch (error) {
      return res.status(401).json({ message: "verification failed" });
    }

    //check if token in DB
    try {
      const token = tokenService.findRefreshToken(userData._id, refreshTokenFromCookie);
      if (!token) {
        return res.status(401).json({ message: "Invalid Token" });
      }
    } catch (error) {
      return res.status(500).json({ message: "Internal error" });
    }

    //Check if valid User
    const user = await userService.findUser({ _id: userData._id });
    if (!user) {
      return res.status(404).json({ message: "No user" });
    }
    //Generate new token
    const { refreshToken, accessToken } = tokenService.generateTokens({ _id: userData._id });

    //update refresh token
    try {
      await tokenService.updateRefreshToken(userData._id, refreshToken);
    } catch (error) {
      return res.status(500).json({ message: "Internal error" });
    }
    //put new token in cookie
    res.cookie("refreshToken", refreshToken, { maxAge: 1000 * 60 * 60 * 24 * 30, httpOnly: true });
    res.cookie("accessToken", accessToken, { maxAge: 1000 * 60 * 60 * 24 * 30, httpOnly: true });
    //response
    const userDto = new UserDto(user);
    res.json({ user: userDto, auth: true });
  }
  async logout(req, res) {
    const { refreshToken } = req.cookies;
    //delete refresh token from db
    await tokenService.removeToken(refreshToken);
    //delete cookies
    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");
    res.json({ user: null, auth: false });
  }
}
module.exports = new AuthController();
