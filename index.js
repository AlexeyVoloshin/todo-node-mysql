const express = require('express');
const path = require('path');
const app = express();
const dbconnect = require('./utils/database');
const routTodo = require('./routs/todo');
const routUser = require('./routs/user');
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public/')));
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use('/api/todo', routTodo);
app.use('/api/user', routUser);

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