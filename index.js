const cookieParser = require('cookie-parser');
const express = require('express');
const path = require('path');
const conf = require('./conf');
const csrf = require('csurf');
const helmet = require('helmet');
const dbconnect = require('./utils/database');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const todoRouts = require('./routs/todo');
const authRouts = require('./routs/auth');
const varMiddleware = require('./middleware/variables');
const invalidCsrfToken = require('./middleware/invalidCsrfToken');

const app = express();


const store = new SequelizeStore({
    collection: 'sessions',
    db: dbconnect,
    checkExpirationInterval: 15 * 60 * 1000,
    expiration: 1 * 60 * 60 * 1000
});
var expiryDate = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

const PORT = process.env.PORT || 4000;

app.use(express.static(path.join(__dirname, 'public/')));

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'some secret value',
    resave: false,
    saveUninitialized: false,
    store,
    cookie: {
        httpOnly: true,
        expires: expiryDate
    }
}));

app.use(csrf({ cookie: true }));

app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        "default-src": ["'self'"],
        "script-src": ["'self'", "cdnjs.cloudflare.com"],
        "object-src": ["'none'"],
        "style-src": ["'self'", "cdnjs.cloudflare.com"],
        "img-src": ["'self'","https:"]
      },
    }
  }));

app.use(varMiddleware);
app.use('/api/auth', authRouts);
app.use('/api/todo', todoRouts);
app.use(invalidCsrfToken);


app.use( (req, res, next) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
    next();
});
async function start() {
    try {
        await dbconnect.sync().then(() => {
            console.log('Tables have been created');
        }).catch(e => console.error(e));
        app.listen(PORT, () => {
            console.log(`Server ${conf.BASE_URL}:${PORT} is runing... `);
        });
    } catch (e) {
        console.error(e);
    }
}
start();