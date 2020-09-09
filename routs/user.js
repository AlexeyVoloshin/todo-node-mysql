const { Router } = require('express');
const User = require('../models/user');
const Todo = require('../models/todo');

const { Op } = require('sequelize');

const router = Router();

router.get('/', async (req, res) => {
    const email = req.body.email;
    try {
        const user = await User.findAll({
            where: {
                email: {
                    [Op.eq]: email
                }
            }
        });
        if (user) {
            res.status(200).json({ user });
        } else {
            res.status(500).json({ message: 'user not found' });
        }
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: e });
    }
});
router.post('/', async (req, res) => {
    const { name, email, password } = req.body;
    console.log('email', req.body);
    try {
        const user = await User.findAll({
            attributes: ['id', 'email'],
            where: {
                email: {
                    [Op.eq]: email
                }
            }
        });

        if (user) {
            await User.create({
                name: 'Alex',
                email: 'voloshin@gmail.com',
                password: 'qazwsx123'
            });
        } else {
            res.status(500).json({ message: 'Пользователь с таким email уже существует' });
        }
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: e });
    }
});

module.exports = router;