const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");

const {
getMindEntries,
createMindEntry
} = require("../controllers/mindController");

const router = express.Router();

router.use(authMiddleware);

router.get("/", getMindEntries);
router.post("/", createMindEntry);

module.exports = router;
