const { Router } = require('express');
const User = require('../models/user');
const { Op } = require('sequelize');
const router = Router();

router.post('/login', async (req, res) => {
    const user = await User.findAll({
        attributes: ['id', 'name', 'email', 'password'],
        where: {
            id: {
                [Op.eq]: 1
            }
        }
    });
    req.session.user = user;
    req.session.isAuthenticated = true;
    req.session.save(err => {
        if (err) {
            throw err;
        }
        res.status(200).json({
            user: req.session.user,
            isAuth: true
        });
    });
});

router.post('/register', async (req, res) => {

});

router.get('/logout', async (req, res) => {
    req.session.destroy(() => {
        res.status(200).json({ isAuth: false });
    });
});

module.exports = router;