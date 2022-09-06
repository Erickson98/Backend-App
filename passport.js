require('dotenv').config()
const GithubStrategy = require('passport-github2').Strategy
const GoogleStrategy = require('passport-google-oauth20').Strategy
const passport = require('passport')

passport.use(
  new GithubStrategy(
    {
      clientID: process.env.REACT_APP_API_CLIENT_ID_GITHUB,
      clientSecret: process.env.REACT_APP_API_CLIENT_SECRET_GITHUB,
      callbackURL: '/auth/github/callback',
    },
    function (accessToken, refreshToken, profile, done) {
      const user = {
        name: profile._json.login,
        email: profile._json.html_url,
        image: profile._json.avatar_url,
      }

      profile = user
      done(null, profile)
    },
  ),
)
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.REACT_APP_API_ID_CLIENT_GOOGLE,
      clientSecret: process.env.REACT_APP_API_CLIENT_SECRET_GOOGLE,
      callbackURL: '/auth/google/callback',
      proxy: true,
    },
    function (accessToken, refreshToken, profile, done) {
      const user = {
        name: profile._json.name,
        email: profile._json.email,
        image: profile._json.picture,
      }
      profile = user
      done(null, user)
    },
  ),
)

passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser((user, done) => {
  done(null, user)
})
