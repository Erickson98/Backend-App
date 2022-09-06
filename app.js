const express = require('express')
const cookieSession = require('cookie-session')
const PersonRouter = require('./routers/Person.routes.js')
const routerUser = require('./routers/user.routes.js')
const http = require('http') //
const { Server } = require('socket.io') //
const cors = require('cors')
var cookieParser = require('cookie-parser')
require('dotenv').config()
const dd = 'ds'
require('./passport.js')
const passport = require('passport')
const authRouter = require('./routers/auth.routes.js')
const s = 'ds'
const app = express()
app.use(cookieParser())

app.use(express.json())
app.set('trust proxy', 1)

app.use(
  cors({
    credentials: true,
    origin: 'https://shiny-tanuki-6e7bda.netlify.app',
    methods: 'GET,POST,PUT,DELETE',
  }),
)
app.use(PersonRouter)

app.use(
  cookieSession({
    name: 'session',
    keys: [process.env.COOKIE_SESSION_KEY],
    sameSite: 'none',
    secure: true,
    maxAge: 200000000000,
  }),
)

app.use(passport.initialize())
app.use(passport.session())

app.use('/auth', authRouter)
app.use(routerUser)

const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: 'https://shiny-tanuki-6e7bda.netlify.app',
    methods: 'GET,POST,PUT,DELETE',
  },
})

io.use((socket, next) => {
  const username = socket.handshake.auth.username
  if (!username) {
    socket.username = username
    return next()
  }
})

io.on('connection', (socket) => {
  socket.join('room1')
  socket.on('newConnection', (message) => {
    socket.username = message.username

    const users = []
    let usersAuxB = []
    let userAux = []
    let name = ''
    for (let [id, socket] of io.of('/').sockets) {
      if (socket.username) {
        users.push({
          userID: id,
          username: socket.username,
        })
      }

      if (
        socket.username === name ||
        (socket.username !== name && name !== '')
      ) {
        if (socket.username !== name) {
          usersAuxB.push({
            userID: id,
            username: socket.username,
          })
        } else {
          usersAuxB.pop()
          usersAuxB.push({
            userID: id,
            username: socket.username,
          })
        }
      }
      name = socket.username
    }

    for (let i = 0; i < usersAuxB.length; i++) {
      for (let u = 0; u < usersAuxB.length; u++) {
        if (i !== u) {
          if (usersAuxB[i].username === usersAuxB[u].username) {
            usersAuxB.splice(i, 1)
            i = 0
            u = 0
          }
        }
      }
    }

    userAux = users.slice(users.length - 1)

    socket.emit('users', users)
    socket.broadcast.emit('userss', users)
  })
  socket.on('getPerson', (data) => {
    socket.broadcast.emit('updateData', data)
  })
  socket.on('getNewUser', () => {
    socket.broadcast.emit('updateUsers')
  })
  socket.on('changeRole', (message) => {
    socket.to(message.idUser[0].userID).emit('newRole', message)
  })
  socket.on('updateOnViewElement', (message) => {
    socket.to(message.idUser[0].userID).emit('updateOnViewElement')
  })
  socket.on('logIn', () => {
    socket.broadcast.emit('UserList')
  })
  socket.on('deleteUser', (message) => {
    socket.to(message.idUser[0].userID).emit('logOutUser')
  })
  socket.on('logOut', (message) => {
    socket.broadcast.emit('updateUsersList', message)
    socket.broadcast.emit('UserList')
  })
})

module.exports = server
