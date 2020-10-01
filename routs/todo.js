const { Router } = require('express');
const auth = require('../middleware/auth');
const findUser = require('../utils/databaseQueries');
const { validationResult } = require('express-validator');
const { addValidators, updateValidators } =require('../utils/validators');
const { Op } = require('sequelize');


const router = Router();
//get all todo list
router.get('/', auth, async (req, res) => {
    const userId = req.session.user.id;
    try {
        const user = await findUser('id', userId);
        user.getTodos()
        .then((todos) => {
            res.status(200).json(todos);
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: e });
    }
});
//criate todo to list
router.post('/', auth, addValidators, async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(422).json({ message: errors.array()[0].msg })
    };
    const userId = req.session.user.id;
    try {
        const user = await findUser('id', userId);
        user.createTodo({
            title: req.body.title,
            done: false
        }).then((responce) => {
            const todo = responce.dataValues;
            res.status(201).json(todo);
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: e });
    }
});
//update todo list
router.put('/:id', auth, updateValidators, async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(422).json({ message: errors.array()[0].msg });
    };
    const idTodo = req.params.id;
    const userId = req.session.user.id;
    try {
    const user = await findUser('id', userId);
        user.getTodos({
            where: {
                id: {
                    [Op.like]: `%${idTodo}%`
                }
            }
        }).then(todo => {
            todo[0].update({ done: req.body.done });
            res.status(200).json(todo[0]);
        }).catch( (e) => {
            throw Error(e)
        }) 
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: e });
    }
});
//delete todo from list
router.delete('/:id', auth, async (req, res) => {
    const idTodo = +req.params.id;
    const userId = req.session.user.id;
    try {
    const user = await findUser('id', userId);
        user.getTodos({
            where: { 
                id: { 
                    [Op.like]: `%${idTodo}%`
                } 
            }
        }).then(todo => {
            todo[0].destroy();
        });
    res.status(204).json({message: true});
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: e });
    }
});

module.exports = router;