const jwt = require('jsonwebtoken')

const User = require('../models/User.js')

const logout = async (req, res) => {
  req.logOut()
  res.clearCookie('session', { path: '/' })
  res.clearCookie('session.sig', { path: '/' })
  res.clearCookie('session 2', { path: '/' })
  res.clearCookie('session 1', { path: '/' })
  res.redirect(process.env.REACT_APP_API_ROUTER_REDIRECT_LOGOUT)
}

const loginFailed = (req, res) => {
  res.status(401).json({
    success: false,
    message: 'failure',
  })
}

const getToken = (req, res) => {
  res.header('Access-Control-Allow-Credentials', 'true')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin,X-Requested-With,Content-Type,Accept',
  )
  res.header(
    'Access-Control-Allow-Origin',
    'https://shiny-tanuki-6e7bda.netlify.app',
  )
  try {
    res.status(200).json({
      cookies: req.cookies,
    })
  } catch (error) {
    res.send(error)
  }
}

const checkRefreshToken = async (req, res, next) => {
  //verificando la session 1

  try {
    if (!req.cookies['session 1']) {
      res.headers['Access-Control-Allow-Origin'] =
        'https://shiny-tanuki-6e7bda.netlify.app'
      return res.send(res.redirect('https://shiny-tanuki-6e7bda.netlify.app'))
    }
    next()
  } catch (error) {
    res.send(error)
  }
}

const checkAccesToken = async (req, res, next) => {
  //comprobacion de session 2

  try {
    if (!req.cookies['session 1']) {
      res.clearCookie('session 2', { path: '/' })
      return res.json({ msg: 'redirected' })
    }

    if (!req.cookies['session 2']) {
      const token = await createToken(req, res, req.cookies['session 1'])

      res.cookie('session 2', token, {
        expires: new Date(Date.now() + 900000),
        httpOnly: true,
      })
    }

    if (!jwt.verify(req.cookies['session 2'], process.env.JWT_SECRET)) {
      return res.json({ msg: 'redirected' })
    }
    console.log('sali')
    next()
  } catch (error) {
    res.send(error)
  }
}

const createToken = async (req, res, refreshToken) => {
  //acces token
  try {
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    res.setHeader(
      'Access-Control-Allow-Origin',
      'https://shiny-tanuki-6e7bda.netlify.app',
    )

    const token = jwt.decode(refreshToken)
    const user = await User.findOne({
      where: { Identificator: token.email || ' ' },
    })

    const accessToken = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: 90000000 },
    )

    return accessToken
  } catch (error) {
    console.log(error)
  }
}
const checkAdmin = async (req, res) => {
  try {
    if (!req.cookies['session 1']) {
      return res.json({ msg: 'redirected' })
    }
    if (!req.cookies['session 2']) {
      await createToken(req, res, req.cookies['session 1'])
    }
    const token = jwt.decode(req.cookies['session 2'])
    const user = await User.findOne({
      where: { _id: token.id || ' ' },
    })
    if (!user.Rol === process.env.REACT_APP_API_ROL_ADMIN) {
      return res.json({ msg: 'redirected' })
    }
    res.status(200).json({ msg: 'success' })
  } catch (error) {
    res.send(error)
  }
}
const createRefreshToken = async (req, res) => {
  try {
    let user = await User.findOne({
      where: { Identificator: req.user.email || ' ' },
    })
    if (!user && req.user.email !== process.env.REACT_APP_API_ROL_ADMIN_USER) {
      user = await User.create({
        Name: req.user.name,
        Identificator: req.user.email,
        Image: req.user.image,
        Rol: 'New',
      })
    } else if (!user) {
      user = await User.create({
        Name: req.user.name,
        Identificator: req.user.email,
        Image: req.user.image,
        Rol: 'Admin',
      })
    }
    const element = {
      email: req.user.email,
    }

    const token = jwt.sign(element, process.env.JWT_SECRET, {
      expiresIn: 900000,
    })

    const elements = {
      refreshToken: token,
      newUser: 'enable',
    }
    return elements
  } catch (error) {
    res.send(error)
  }
}

const credentials = async (req, res) => {
  if (!req.user) {
    return res.json({ msg: 'redirected' })
  }
  if (!req.cookies['session 1'] && req.cookies['session 2']) {
    res.clearCookie('session 2', { path: '/' })
    return res.json({ msg: 'redirected' })
  } else if (!req.cookies['session 1']) {
    const elements = await createRefreshToken(req, res)
    res.cookie('session 1', elements.refreshToken, {
      expires: new Date(Date.now() + 900000),
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    })

    if (!req.cookies['session 2']) {
      const accesToken = await createToken(req, res, elements.refreshToken)
      res.cookie('session 2', accesToken, {
        expires: new Date(Date.now() + 900000),
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      })
    }
    return res.status(200).json({ msg: 'success', newUser: elements.newUser })
  } else if (!req.cookies['session 2']) {
    const accesToken = await createToken(req, res, req.cookies['session 1'])
    res.cookie('session 2', accesToken, {
      expires: new Date(Date.now() + 900000),
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    })
  }
  res.status(200).json({ msg: 'success' })
}
const searchDataBase = async (req, res) => {
  try {
    console.log(req?.user)

    if (!req.cookies['session 1']) {
      return res.json({ msg: 'redirected', re: req })
    }

    const token = req.cookies['session 2']
    const decoded = jwt.decode(token)
    let element = await User.findOne({
      where: { _id: decoded.id || ' ' },
    })
    if (!element || element == ' ') {
      return res.json({ msg: 'redirected' })
    }
    const user = {
      id: element._id,
      name: element.Name,
      email: element.Identificator,
      image: element.Image,
      rol: element.Rol,
    }
    res.status(200).json({
      sucessfully: true,
      user,
    })
  } catch (error) {
    res.send(error)
  }
}

module.exports = {
  logout,
  loginFailed,
  getToken,
  checkRefreshToken,
  checkAccesToken,
  credentials,
  searchDataBase,
  checkAdmin,
}
