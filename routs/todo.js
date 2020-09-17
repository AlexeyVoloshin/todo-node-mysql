const { Router } = require('express');
const User = require('../models/user');
const auth = require('../middleware/auth');

const router = Router();
//get all todo list
router.get('/', auth, async (req, res) => {
    const id = req.session.user.id;
    try {
        await User.findByPk(id).then(user => { 
            if (!user) {
                return console.log('User not found');
            }

            user.getTodos()
                .then((todos) => {
                    res.status(200).json(todos);
                });
        }).catch(e => {
            console.error(e);
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: e });
    }
});
//criate todo to list
router.post('/', auth, async (req, res) => {
    const userId = req.session.user.id;
    console.log(userId);
    try {
        await User.findByPk(userId).then(user => {
            if (!user) {
                return console.log("User not found");
            }
            user.createTodo({
                title: req.body.title,
                done: false
            }).then((responce) => {
                const todo = responce.dataValues;
                res.status(201).json(todo);

            });
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: e });
    }
});
//update todo list
router.put('/:id', auth, async (req, res) => {
    const id = +req.params.id;
    const userId = req.session.user.id;
    try {
        await User.findByPk(userId).then(user => {
            if (!user) {
                return console.log("User not found");
            }
            user.getTodos({
                where: {
                    id
                }
            }).then(todo => {
                todo[0].update({ done: req.body.done });
                res.status(200).json(todo[0]);
            });
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: e });
    }
});
//delete todo from list
router.delete('/:id', auth, async (req, res) => {
    const id = +req.params.id;
    const userId = req.session.user.id;
    try {
        await User.findByPk(userId).then(user => {
            if (!user) {
                return console.log("User not found");
            }
            user.getTodos({
                where: { id }
            }).then(todo => {
                todo[0].destroy();
            });
        });
        res.status(204).json({});
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: e });
    }
});

module.exports = router;