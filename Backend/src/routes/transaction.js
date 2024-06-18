const express = require("express");
const transactionController = require("../controllers/transactionController");
const router = express.Router();

router.get("/", transactionController.list);
router.post("/add", transactionController.add);
router.get("/by-client/:emailClient", transactionController.getByEmail);
router.get("/by-coin/:coin", transactionController.getByCoin);
module.exports = router;