const express = require('express')
const cors = require('cors')
const session = require('express-session')
const passport = require('passport')
const app = express()

const { appPort, frontendUrl } = require('./Config/app')


//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({origin: `${frontendUrl}`, credentials: true}));
app.use('/public',express.static(__dirname + '/public'));
app.use(
    session({
        secret: 'secretCode',
        resave: true,
        saveUninitialized: true,
    })
);
app.use(passport.initialize());
app.use(passport.session());



//Routes
app.use(require('./Routes/auth.routes'));
app.use(require('./Routes/entorno.routes'));
app.use(require('./Routes/actividad.routes'))
app.use(require('./Routes/archivo.routes'))
app.use(require('./Routes/comentario.routes'))


app.listen(appPort, () => {
    console.log(`Server listening on port ${appPort}`);
})