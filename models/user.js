const { DataTypes } = require("sequelize");
const sequelize = require("../config/bancodedados");

const User = sequelize.define("User", {
  name: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
  },
  password: {
    type: DataTypes.STRING,
  },
});

module.exports = User;
