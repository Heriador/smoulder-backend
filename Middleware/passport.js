const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt.fromAuthHeaderAsBearerToken();
const passport = require('passport')
const Usuario = require('../models').Usuario
const Roles = require('../models').Roles
const { appKey } = require('../Config/app')

passport.serializeUser((user,done) => {
    return done(null, user.id)
})

passport.deserializeUser((id,done) => {
    Usuario.findByPk(id,{
        include: [{
            model: Roles,
            as: 'Rol'
        }],
        attributes: {
            exclude: ['rol']
        }
    })
        .then(user => {
            delete user.dataValues.contraseña
            return done(null, user)
        })
        .catch(err => {
            return done(err, null)
        })
})

passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt,
    secretOrKey: appKey,
},(payload, done) => {
    Usuario.findByPk(payload.id,{
        include: [{
            model: Roles,
            as: 'Rol'
        }],
        attributes: {
            exclude: ['rol']
        }
    })
        .then(user => {
            delete user.dataValues.contraseña
            return done(null, user)
        })
        .catch(err => {
            return done(err, null)
        })
}))



module.exports = passport;