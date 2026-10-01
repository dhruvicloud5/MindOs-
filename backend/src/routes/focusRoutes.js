const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");

const {
getFocusSessions,
createFocusSession,
completeFocusSession
,
deleteFocusSession
} = require("../controllers/focusController");

const router = express.Router();

router.use(authMiddleware);

router.get("/", getFocusSessions);
router.post("/", createFocusSession);
router.patch("/:id/complete", completeFocusSession);
router.delete("/:id", deleteFocusSession);

module.exports = router;
