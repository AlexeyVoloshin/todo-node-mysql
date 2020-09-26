const { Router } = require('express');
const auth = require('../middleware/auth');
const findUser = require('../utils/userVerification');

const router = Router();
//get all todo list
router.get('/',  async (req, res) => {
//    const token = req.cookies['AccessToken'];
// 	console.log(token)
//   if (token !== '***Auth token value***') {
// 	return res.status(401).json({ message: 'wrong token' });
//   }
    // const id = req.session.user.id;
    try {
        const user = await findUser(1);
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
router.post('/', auth, async (req, res) => {
    //сделать добавление todo через модель пользователя
    const id = req.session.user.id;
    try {
        const user = await findUser(id);
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
router.put('/:id', auth, async (req, res) => {
    const idTodo = +req.params.id;
    const userId = req.session.user.id;
    try {
    const user = await findUser(userId);
    user.getTodos({
        where: {
            idTodo
        }
    }).then(todo => {
        todo[0].update({ done: req.body.done });
        res.status(200).json(todo[0]);
    });
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
    const user = await findUser(userId);
        user.getTodos({
            where: { id }
        }).then(todo => {
            todo[0].destroy();
        });
    res.status(204).json({});
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: e });
    }
});

module.exports = router;