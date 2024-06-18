const express = require("express");
const expectantController = require("../controllers/expectantController");
const router = express.Router();

router.get("/", expectantController.list);
router.post("/add", expectantController.add);
router.get("/:id", expectantController.getById);

module.exports = router;