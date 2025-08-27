const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    if(err.code === 11000){
        const field = Object.keys(err.keyValue)[0];
        return res.status(400).json({
            message: `${field} already exists`
        });
    }

    if(err.name === 'ValidationError'){
        const errors = Object.values(err.errors).map(e=> e.message);
        return res.status(400).json({
            message: 'Validation failed',
            errors
        })
    }

    res.status(500).json({
        message: 'Something went wrong'
    })
}

module.exports = errorHandler;