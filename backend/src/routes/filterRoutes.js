const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");

const {
getFilters,
createFilter,
toggleFilter,
deleteFilter
} = require("../controllers/filterController");

const router = express.Router();

router.use(authMiddleware);

router.get("/", getFilters);
router.post("/", createFilter);
router.patch("/:id/toggle", toggleFilter);
router.delete("/:id", deleteFilter);

module.exports = router;
