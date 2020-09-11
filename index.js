const express = require('express');
const path = require('path');
const app = express();
const session = require('express-session');
const dbconnect = require('./utils/database');
const todoRouts = require('./routs/todo');
// const userRouts = require('./routs/user');
const authRouts = require('./routs/auth');
const varMiddleware = require('./middleware/variables');
const User = require('./models/user');
const { Op } = require('sequelize');

const PORT = process.env.PORT || 3000;

// app.use(async (req, res, next) => {
//     try {
//         const user = await User.findAll({
//             attributes: ['id', 'name', 'email', 'password'],
//             where: {
//                 id: {
//                     [Op.eq]: 1
//                 }
//             }
//         });
//         req.user = user;
//         next();
//     } catch (error) {
//         console.error(error);
//     }
// })

app.use(express.static(path.join(__dirname, 'public/')));
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'some secret value',
    resave: false,
    saveUninitialized: false
}));
app.use(varMiddleware);
app.use('/api/todo', todoRouts);
// app.use('/api/user', userRouts);
app.use('/api/auth', authRouts);

app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
})
async function start() {
    try {
        await dbconnect.sync().then(() => {
            console.log('Tables have been created')
        }).catch(e => console.error(e));
        app.listen(PORT, () => {
            console.log(`Server is runing on port ${PORT}`);
        });
    } catch (e) {
        console.error(e);
    }
}
start();