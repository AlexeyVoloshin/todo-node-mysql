const cookieParser = require('cookie-parser');
const express = require('express');
const path = require('path');
const csrf = require('csurf');
const dbconnect = require('./utils/database');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const todoRouts = require('./routs/todo');
const authRouts = require('./routs/auth');
const varMiddleware = require('./middleware/variables');

const app = express();
const store = new SequelizeStore({
    collection: 'sessions',
    db: dbconnect,
    checkExpirationInterval: 15 * 60 * 1000,
    expiration: 1 * 60 * 60 * 1000
});

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public/')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'some secret value',
    resave: false,
    saveUninitialized: false,
    store
}));
app.use(cookieParser());
app.use(csrf());
app.use(varMiddleware);
app.use('/api/todo', todoRouts);
app.use('/api/auth', authRouts);

app.use((req, res, next) => {
    res.header('x-csrf-token', req.csrf);
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
    next();
});
async function start() {
    try {
        await dbconnect.sync().then(() => {
            console.log('Tables have been created');
        }).catch(e => console.error(e));
        app.listen(PORT, () => {
            console.log(`Server is runing on port ${PORT}`);
        });
    } catch (e) {
        console.error(e);
    }
}
start();