const express = require("express");
const productController = require("../controllers/productController");
const upload = require("../middlewares/uploadImages");
const router = express.Router();

router.get("/", productController.list);
router.post("/add", upload.single('image'), productController.add);
router.delete("/:id", productController.delete);
router.put("/:id", productController.update);
router.get("/destacados", productController.getOutstanding);
router.get("/image/:image", productController.getImage);

module.exports = router;
