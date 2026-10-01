const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");

const {
	getExplorations,
	createExploration,
	updateExploration,
	deleteExploration,
	searchGoogle
} = require("../controllers/exploreController");

const router = express.Router();

router.use(authMiddleware);

router.get("/", getExplorations);
router.post("/", createExploration);
router.post("/search", searchGoogle);
router.patch("/:id", updateExploration);
router.delete("/:id", deleteExploration);

module.exports = router;
