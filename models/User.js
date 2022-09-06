require('dotenv').config()

const TABLE_NAME = 'Roles'
const sequelize = require('../database/database.js')

const { DataTypes } = require('sequelize')

const User = sequelize.define(TABLE_NAME, {
  _id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
  },
  Name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  Identificator: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
  Image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  Rol: {
    type: DataTypes.STRING,
    allowNull: true,
  },
})

module.exports = User
