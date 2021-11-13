const router = require('express').Router();

const { crear, obtener, eliminar } = require('../Controllers/Archivos.controller');
const passport = require('passport');
const { multer } = require('../Middleware/multer')

require('../Middleware/passport')

router.post('/archivo/crear',[passport.authenticate('jwt', { session: false }), multer.single('file')] ,crear);
router.get('/archivo/obtener', [passport.authenticate('jwt', { session: false })], obtener)
router.delete('/archivo/eliminar/:id', [passport.authenticate('jwt', { session: false })], eliminar)

module.exports = router;