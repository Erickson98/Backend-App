require('dotenv').config()

const { Sequelize } = require('sequelize')
const sequelize = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DATABASE_PROFILE,
  process.env.DATABASE_PASSWORD,
  {
    host: process.env.DATABASE_HOST,
    dialect: process.env.DATABASE_DIALECT,
  },
)
//bd860f388cb2bf:e5722c0c@us-cdbr-east-06.cleardb.net/heroku_64fbc8e1452dc77?reconnect=true
module.exports = sequelize
