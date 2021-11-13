const route = require('express').Router();

const { index, crearActividad, eliminarActividad, actualizarEstadoActividad } = require('../Controllers/Actividad.controller');
const passport = require('passport');
const { multer } = require('../Middleware/multer')
const { isJefe } = require('../Middleware/validaciones')

require('../Middleware/passport')


route.post('/actividad/crear',[passport.authenticate('jwt', {session: false}), multer.any(), isJefe], crearActividad)
route.get('/actividad/listar',passport.authenticate('jwt', {session: false}), index )
route.put('/actividad/actualizarEstado/:id',passport.authenticate('jwt', {session: false}), actualizarEstadoActividad )
route.delete('/actividad/eliminar/:id',passport.authenticate('jwt', {session: false}), eliminarActividad )

module.exports = route;