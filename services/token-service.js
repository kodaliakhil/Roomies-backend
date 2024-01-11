const jwt = require("jsonwebtoken");
const refreshModal = require("../models/refresh-modal");
const JWT_ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET;
const JWT_REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_TOKEN_SECRET;
class TokenService {
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, JWT_ACCESS_TOKEN_SECRET, { expiresIn: "1m" });
    const refreshToken = jwt.sign(payload, JWT_REFRESH_TOKEN_SECRET, { expiresIn: "1y" });
    return { accessToken, refreshToken };
  }
  async storeRefreshToken(token, userId) {
    try {
      await refreshModal.create({ token, userId });
    } catch (e) {
      console.log(e.message);
    }
  }
  async verifyAccessToken(token) {
    return jwt.verify(token, JWT_ACCESS_TOKEN_SECRET);
  }
  async verifyRefreshToken(refreshToken) {
    return jwt.verify(refreshToken, JWT_REFRESH_TOKEN_SECRET);
  }
  async findRefreshToken(userId, refreshToken) {
    return await refreshModal.findOne({
      userId: userId,
      token: refreshToken,
    });
  }
  async updateRefreshToken(userId, refreshToken) {
    return await refreshModal.updateOne({ userId: userId }, { token: refreshToken });
  }
  async removeToken(refreshToken) {
    return await refreshModal.deleteOne({ token: refreshToken });
  }
}

module.exports = new TokenService();
