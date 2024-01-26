const notFound = (req, res) => res.status(404).send('The Route does not exist')

module.exports = notFound
