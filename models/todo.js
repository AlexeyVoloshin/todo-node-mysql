const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const todo = sequelize.define('Todo', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        type: Sequelize.INTEGER
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    done: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    }
});

module.exports = todo;