const User =require('../models/user');

const findUser = async function(id) {
    console.log(id)
  const user =  await User.findByPk(id) //находим пользователя в базе и подтягивает его todo list из таблицы todo
        if (!user) {
            return console.log('User not found');
        } else {
            return user;
        }
}

module.exports = findUser;

