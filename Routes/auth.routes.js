const route = require('express').Router()
const passport = require('../Middleware/passport')
const { multer } = require('../Middleware/multer')
const { login, register, update } = require('../Controllers/Auth.controller');


route.post('/login', login)
route.post('/register', register)

route.get('/logout', (req, res) => {
    req.logout()
});

route.post('/update', [passport.authenticate('jwt', { session: false }), multer.any()] ,update)

module.exports = route;