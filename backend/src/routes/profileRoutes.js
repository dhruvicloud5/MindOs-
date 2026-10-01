const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");

const {
getProfile
} = require("../controllers/profileController");

const router = express.Router();

router.use(authMiddleware);

router.get("/", getProfile);

module.exports = router;
