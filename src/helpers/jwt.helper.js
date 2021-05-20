var jwt = require('jsonwebtoken');

const createAccessJWT = (payLoad) => {
    var accessJWT = jwt.sign({ payLoad },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: '15m' });

    return Promise.resolve(accessJWT);
}

const createRefershJWT = (payLoad) => {
    var refreshJWT = jwt.sign({ payLoad }
        , process.env.JWT_REFRESH_SECRET,
        { expiresIn: '30d' });

    return Promise.resolve(refreshJWT);
}


module.exports = {
    createAccessJWT,
    createRefershJWT
}
