const express = require('express');
const genresController = require("../controllers/genresController");
const router = express.Router();

router.route("/").get(genresController.getGenres)

module.exports = router;