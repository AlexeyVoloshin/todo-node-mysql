function invalidCsrfToken(err, req, res, next) {
    if(err.code !== 'EBADCSRFTOKEN') return next(err);

    res.status(403);
    res.send('sesion has expired or from tampered with');
}

module.exports = invalidCsrfToken;