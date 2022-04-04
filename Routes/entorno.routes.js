const route = require('express').Router()
const passport = require('../Middleware/passport')
// require('../Middleware/passport')
const { isJefe } = require('../Middleware/validaciones') 
const { create, index, unirse, eliminar  } = require('../Controllers/Entorno.controller')


route.get('/env', passport.authenticate('jwt', {session: false}) ,index)
route.post('/env/crear', [passport.authenticate('jwt', {session: false}), isJefe] , create)
route.post('/env/unirse', passport.authenticate('jwt', {session: false}) , unirse)
route.delete('/entorno/eliminar/:id', passport.authenticate('jwt', {session: false}) , eliminar)


module.exports = route