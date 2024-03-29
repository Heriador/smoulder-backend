const route = require('express').Router();
const passport = require('../Middleware/passport');
const { multer } = require('../Middleware/multer');
const { login, register, update } = require('../Controllers/Auth.controller');

route.post('/login', login);
route.post('/register', register);

route.get(
  '/logout',
  [passport.authenticate('jwt', { session: false })],
  (req, res) => {
    req.logout(function (err) {
      if (err)
        return res.status(500).json({ message: 'Error al cerrar sesión' });
      return res.status(200).json({ message: 'Sesión cerrada' });
    });
  }
);

route.post(
  '/update',
  [passport.authenticate('jwt', { session: false }), multer.any()],
  update
);

module.exports = route;
