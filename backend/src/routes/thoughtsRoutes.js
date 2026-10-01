const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");

const {
getThoughts,
createThought,
deleteThought
} = require("../controllers/thoughtsController");

const router = express.Router();

router.use(authMiddleware);

router.get("/", getThoughts);
router.post("/", createThought);
router.delete("/:id", deleteThought);

module.exports = router;
