const express = require('express');
const authorsController = require("../controllers/authorsController");
const router = express.Router();

router.route("/").get(authorsController.getAuthors)

module.exports = router;