const route = require('express').Router()
const passport = require('../Middleware/passport')

const { multer } = require('../Middleware/multer')
const { login, register, googleAuth, update } = require('../Controllers/Auth.controller');
const { frontendUrl } = require('../config/app');



route.post('/login', login)
route.post('/register', register)


route.get('/auth/google',
  passport.authenticate('google', { scope: ['profile','email'] }));

route.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect(`${frontendUrl}`);
});

route.get('/auth/google/get', googleAuth)
route.get('/logout', (req, res) => {
    if(req.user){
      req.logout();
      console.log(req.user);
    }
});


route.post('/update', [passport.authenticate('jwt', { session: false }), multer.any()] ,update)

module.exports = route;