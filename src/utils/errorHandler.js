const handleError = (error, res) => {
    res.status(error.status || 500)
    console.log(error);
    res.json({ message: error.message });

}

module.exports = handleError; 