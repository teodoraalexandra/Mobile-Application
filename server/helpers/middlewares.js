function mustBeInteger(req, res, next) {
    const id = req.params.id
    if (!Number.isInteger(parseInt(id))) {
        res.status(400).json({ message: 'Id must be integer' })
    } else {
        next()
    }
}

module.exports = {
    mustBeInteger
}