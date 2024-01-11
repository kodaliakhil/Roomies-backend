const router = require("express").Router();
const activateController = require("./controllers/activate-controller");
const authController = require("./controllers/auth-controller");
const roomsController = require("./controllers/rooms-controller");
const authMiddleware = require("./middlewares/auth-middleware");

router.get("/", (req, res) => {
  res.send("Hello from backend");
});
router.get("/test1", (req, res) => {
  res.send("Hello from test-1");
});
router.get("/test2", (req, res) => {
  res.send("Hello from test-2");
});
router.post("/api/send-otp", authController.sendOtp);
router.post("/api/verify-otp", authController.verifyOtp);
router.post("/api/activate", authMiddleware, activateController.activate);
router.get("/api/refresh", authController.refresh);
router.post("/api/logout", authMiddleware, authController.logout);
router.post("/api/rooms", authMiddleware, roomsController.create);
router.get("/api/rooms", authMiddleware, roomsController.index);
router.get("/api/rooms/:roomId", authMiddleware, roomsController.show);

module.exports = router;
