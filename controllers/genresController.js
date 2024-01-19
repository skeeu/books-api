const { genres} = require('../models/bookModels');

const getGenres = (req, res) => {
    if (genres.length === 0) {
        res.status(404).json({
            status: 'Not found',
            message: `No genres`,
        });
    }
    res.status(200).json({
        status: 'success',
        results: genres.length,
        data: {
            genres,
        },
    });
}

module.exports = {
    getGenres
}