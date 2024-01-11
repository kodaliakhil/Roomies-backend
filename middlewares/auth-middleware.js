const tokenService = require("../services/token-service");

module.exports = async function (req, res, next) {
  // console.log(Object.keys(req))
  try {
    const { accessToken } = req.cookies;
    if (!accessToken) {
      throw new Error();
    }
    const userData = await tokenService.verifyAccessToken(accessToken);
    if (!userData) {
      throw new Error();
    }
    // console.log(userData);
    req.user = userData;
    next();
  } catch (err) {
    console.log(err)
    res.status(401).json({ message: "Invalid Token" });
  }
};
