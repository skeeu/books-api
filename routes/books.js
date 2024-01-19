const express = require('express');
const bookController = require("../controllers/bookController");
const router = express.Router();

router.route("/").get(bookController.getBooks).post(bookController.createBook)
router.route("/:bookId").delete(bookController.deleteBook).put(bookController.updateBook)
module.exports = router;