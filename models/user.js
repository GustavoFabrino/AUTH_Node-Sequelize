const { DataTypes } = require("sequelize");
const sequelize = require("../config/bancodedados");

const User = sequelize.define(
  "User",
  {
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    max_storage: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    used_storage: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    idstorage: {
      type: DataTypes.STRING(100),
      unique: true,
    },
  },
  {
    tableName: "users", // Opcional, especifica o nome da tabela no banco de dados
    timestamps: true, // Opcional, adiciona timestamps (createdAt e updatedAt)
    hooks: {
      beforeCreate: async (user) => {
        // Cria o valor de idstorage combinando o id e o nome
        const nextId = (await User.count()) + 1; // Este é um método simples para obter o próximo ID, pode variar dependendo do SGDB
        user.idstorage = `${nextId}${user.name}`;
      },
    },
  }
);

module.exports = User;
