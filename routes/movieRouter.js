const express = require('express');
const movieRouter = express.Router();
const cors = require('cors');
const movieController = require('../controller/movieController');

movieRouter.use(cors())

movieRouter.get('/', movieController.getMovies)
movieRouter.post('/', movieController.addMovie)

module.exports = movieRouter;