const express = require("express");
const ticketController = require("../controllers/ticketController");
const router = express.Router();

router.get("/", ticketController.list);
router.get('/:id', ticketController.getById);
router.post("/add", ticketController.add);
router.delete("/:id", ticketController.delete);
router.put("/:id", ticketController.update);
router.get("/by-category/:category", ticketController.getByCategory);

module.exports = router;