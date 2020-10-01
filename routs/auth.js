const { Router } = require('express');
const User = require('../models/user');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const findUser = require('../utils/databaseQueries');
const { validationResult } = require('express-validator');
const { loginValidators, registerValidators } =require('../utils/validators');

const router = Router();

router.post('/login', loginValidators, async (req, res) => {
try {
    const { email: value} = req.body;
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(422).json({ message: errors.array()[0].msg})
    }
    const candidate = await findUser('email', value);
        const isAuthUser = {
            id: candidate.id,
            name: candidate.name,
            email: candidate.email
        }
        req.session.user = isAuthUser;
        req.session.isAuthenticated = true;
        req.session.save(err => {
            if (err) {
                throw err;
            }
            res.status(200).json({
                user: isAuthUser,
                isAuth: true
            });
        });
} catch (error) {
    console.error(error);
}
});

router.post('/register', registerValidators, async (req, res) => {
try {
    const { name, email, password } = req.body;

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(422).json({ message: errors.array()[0].msg});
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