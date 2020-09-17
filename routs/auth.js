const { Router } = require('express');
const User = require('../models/user');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const router = Router();

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const candidate = await User.findAll({
            attributes: ['id', 'name', 'email', 'password'],
            where: {
                email: {
                    [Op.eq]: email
                }
            }
        });

        if (!candidate[0]) {
            return res.status(401).json({ message: 'user not found' });
        } else {
            const areSame = await bcrypt.compare(password, candidate[0].password);
            if (!areSame) {
                return res.status(401).json({ message: 'wrong password' });
            } else {
                req.session.user = candidate[0];
                req.session.isAuthenticated = true;
                req.session.save(err => {
                    if (err) {
                        throw err;
                    }
                    res.status(200).json({
                        user: candidate[0],
                        isAuth: true
                    });
                });
            }
        }
    } catch (error) {
        console.error(error);
    }
});

router.post('/register', async (req, res) => {
    try {
        const { name, email, password, repeat } = req.body;
        const candidate = await User.findAll({
            attributes: ['email'],
            where: {
                email: {
                    [Op.eq]: email
                }
            }
        });

        if (candidate[0]) {
            return res.status(401).json({ message: 'user is already registered' });
        }
        const hashPassword = await bcrypt.hash(password, 10);
        await User.create({
            name, email, password: hashPassword
        })
            .then(() => {
                res.status(201).json({ create: true });
            })
    } catch (error) {
        console.error(error);
    }
});

router.get('/logout', async (req, res) => {
    req.session.destroy(() => {
        res.status(200).json({ isAuth: false });
    });
});

module.exports = router;