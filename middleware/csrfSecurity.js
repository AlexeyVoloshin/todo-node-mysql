const csrf = require('csurf');

module.exports = function (req, res, next) {
    csrf({ cookie: true });

    next();
};