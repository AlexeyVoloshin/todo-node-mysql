const Sequelize = require('sequelize');
const conf = require("../conf")

const DB_NAME = conf.DB_NAME;
const USER_NAME = conf.USER_NAME;
const PASSWORD = conf.PASSWORD;

const dbconnect = new Sequelize(DB_NAME, USER_NAME, PASSWORD, {
    host: conf.MYSQL_HOST,
    dialect: 'mysql'
});

module.exports = dbconnect;