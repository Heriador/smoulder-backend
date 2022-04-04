const route = require('express').Router();
const { crear, obtener, eliminar } = require('../Controllers/Comentario.controller')
const passport = require('../Middleware/passport');

// require('../Middleware/passport')

route.get('/comentarios', passport.authenticate('jwt', { session: false }), obtener)
route.post('/comentario/crear', passport.authenticate('jwt', { session: false }), crear)
route.delete('/comentario/eliminar/:id', passport.authenticate('jwt', { session: false }), eliminar)


module.exports = route;