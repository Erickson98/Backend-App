require('dotenv').config()

const app = require('./app.js')
const sequelize = require('./database/database.js')
const main = async () => {
  try {
    await sequelize.sync({ alter: true })
    app.listen(process.env.PORT || '4000')
  } catch (error) {
    console.log(error)
  }
}

main()
