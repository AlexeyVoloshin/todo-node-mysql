module.exports = function (req, res, next) {
    res.locals.isAuth = req.session.isAuthenticated;
    req.csrf = req.csrfToken();

    next();
};