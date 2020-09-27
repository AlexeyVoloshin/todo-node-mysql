const User =require('../models/user');

const findUser = async function(id) {
  const user =  await User.findByPk(id) //we find the user in the database and pulls up his list of tasks from the task table
        if (!user) {
            return console.log('User not found');
        } else {
            return user;
        }
}

module.exports = findUser;

