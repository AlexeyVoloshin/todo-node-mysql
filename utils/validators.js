const { body, checkSchema  } = require('express-validator');
const findUser = require('./databaseQueries');
const bcrypt = require('bcryptjs');

loginValidators = [
    body('email').isEmail().withMessage('Enter the correct email')
    .custom(async (value, { req }) => {
        try {
            const user = await findUser('email', value);
            
            if(!user) {
                return Promise.reject('User with such emeil not found');
            }
        } catch (e) {
            console.error(e);
        }
    }).normalizeEmail(),
    body('password', 'Password must be at least 6 characters')
        .custom(async (value, { req }) => {
            try {
                const user = await findUser('email', req.body.email);
                const pass = await bcrypt.compare(value, user.password);
                if(!pass) {
                    return Promise.reject('Incorrect password!')
                }
            } catch (e) {
                console.error(e);
            }
        })
        .trim()
        .isLength({ min: 6 })
];
registerValidators = [
    body('email').isEmail().withMessage('Enter the correct email')
        .custom(async (value, { req }) => {
            try {
                console.log(value)
                const user = await findUser('email', value);
                if(user) {
                    return Promise.reject('A user with this email is already registered!');
                }
            } catch (e) {
                console.error(e);
            }
        }).normalizeEmail(),
    body('password', 'Password must be at least 6 characters')
        .trim()
        .isLength({ min: 6, max: 30}),
    body('confirm').custom((value, { req, res }) => {
        if(value !== req.body.password) {
            throw new Error('Passwords must match')
        } else {
            return true
        }
    }).trim(),
    body('name').isLength({ min: 2 })
        .withMessage('The name must be at least 2 characters')
        .trim()
];
addValidators = [
    checkSchema({
        title: {
            in: ['body'],
            isLength: {
                errorMessage: 'The name must be at least 7 characters!',
                options: { min: 7 }
            }
        },
    })
];
updateValidators = [
    checkSchema({
        id: {
            in: ['params'],
            errorMessage: 'ID is wrong',
            isInt: true,
            toInt: true
        },
        done: {
            in: ['body'],
            errorMessage: 'Done not boolean!',
            isBoolean: true,
            toBoolean: true
        }
    })
]
module.exports = {
    loginValidators,
    registerValidators,
    addValidators,
    updateValidators
}