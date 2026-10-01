const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");

const {
  getReprograms,
  createReprogram,
  completeReprogram,
  deleteReprogram
} = require("../controllers/reprogramController");

const router = express.Router();

router.use(authMiddleware);

router.get("/", getReprograms);

router.post("/", createReprogram);

router.patch("/:id/complete", completeReprogram);

router.delete("/:id", deleteReprogram);

module.exports = router;
