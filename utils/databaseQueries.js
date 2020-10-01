const User =require('../models/user');
const { Op } = require("sequelize");

const findUser = async function(key, value) {
  const user =  await User.findAll({
      where: {
        [key]: {
            [Op.like]: `%${value}%`
        },
      }
  }) 
return user[0];
}

module.exports = findUser;

