const GoogleStrategy = require('passport-google-oauth20').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt.fromAuthHeaderAsBearerToken();
const passport = require('passport')
const Usuario = require('../models').Usuario
const Roles = require('../models').Roles
const { clientId, clientSecret, appKey } = require('../Config/app')

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


passport.use(new GoogleStrategy({
    clientID: clientId,
    clientSecret,
    callbackURL: "/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    Usuario.findOne({
        where: {
            correo: profile.emails[0].value
        }
    })
    .then(usuario => {
        if(!usuario){
            Usuario.create({ 
                nombre: profile.name.givenName,
                apellido: profile.name.familyName,
                correo: profile.emails[0].value,
                contraseña: profile.id,
                googleId: profile.id,
                avatar: profile.photos[0].value,
                rol: 2
            })
            .then(newUser => {
                return cb(null, newUser)
            })

            
        }
        else{
            Usuario.update({
                googleId: profile.id,
                avatar: profile.photos[0].value,
            },{
                where:{
                    id: usuario.id
                },
                fields: ['googleId', 'avatar'],
                returning: true
            })
            .then(([rows, result]) => {
                return cb(null, result[0])
            })
        }
    })
    .catch(err => {
        cb(err, null)
    })
  }
));

module.exports = passport;