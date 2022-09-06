require("dotenv").config();

const TABLE_NAME = "People";
const sequelize = require("../database/database.js");

const { DataTypes } = require("sequelize");

const Person = sequelize.define(TABLE_NAME, {
  _id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
  },
  Name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  LastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Date: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Person;
