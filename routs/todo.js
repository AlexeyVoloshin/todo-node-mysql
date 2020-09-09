const { Router } = require('express');
const Todo = require('../models/todo');
const { Op } = require("sequelize");
const User = require('../models/user');
const todo = require('../models/todo');

const router = Router();
//get all todo list
router.get('/', async (req, res) => {
    const id = 1;
    try {
        await User.findByPk(id).then(user => { //находим пользователя в базе и подтягивает его todo list из таблицы todo
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
router.post('/', async (req, res) => {
    //сделать добавление todo через модель пользователя
    const userId = 1;
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
router.put('/:id', async (req, res) => {
    const id = +req.params.id;
    const userId = 1;
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
                res.status(200).json(todo);
            });
        });
        // await Todo.update({ done: req.body.done }, {
        //     where: {
        //         id
        //     }
        // });
        // const todo = await Todo.findAll({
        //     where: {
        //         id: {
        //             [Op.eq]: id
        //         }
        //     }
        // });
        // res.status(200).json(todo[0]);
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: e });
    }
});
//delete todo from list
router.delete('/:id', async (req, res) => {
    const id = +req.params.id;
    const userId = 1;
    try {
        await User.findByPk(userId).then(user => {
            if (!user) {
                return console.log("User not found");
            }
            user.getTodos({
                where: { id }
            }).then(todo => {
                // const data2 = data.filter(item => item.id == id);
                // user.removeTodos(data2, { force: true });
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