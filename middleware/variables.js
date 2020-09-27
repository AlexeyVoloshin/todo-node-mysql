module.exports = function (req, res, next) {
    res.locals.isAuth = req.session.isAuthenticated;
    res.header('x-csrf-token', req.csrfToken());
    
    next();
};