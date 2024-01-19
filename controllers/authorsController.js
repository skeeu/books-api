const { authors} = require('../models/bookModels');

const getAuthors = (req, res) => {
    if (authors.length === 0) {
        res.status(404).json({
            status: 'Not found',
            message: `No authors`,
        });
    }
    res.status(200).json({
        status: 'success',
        results: authors.length,
        data: {
            authors,
        },
    });
}

module.exports = {
    getAuthors
}