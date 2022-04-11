

const express = require('express')
const cors = require('cors')
const session = require('express-session')
const passport = require('passport')
const app = express()

const { appPort, frontendUrl } = require('./Config/app.js')
const hash = require('crypto').Hash('sha256', 'base64')


//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({origin: [`${frontendUrl}`, 'https://lh3.googleusercontent.com'], credentials: true}));
app.use('/public',express.static(__dirname + '/public'));
app.use(
    session({
        secret: `${hash}`,
        resave: true,
        saveUninitialized: true,
    })
);
app.use(passport.initialize());
app.use(passport.session());

if(process.env.NODE_ENV !== 'production'){
    const morgan = require('morgan')
    app.use(morgan('dev'));

}

//landing

app.get('/', (req, res) => {
    res.send('Hello World!')
})

//Routes
app.use(require('./Routes/auth.routes'));
app.use(require('./Routes/entorno.routes'));
app.use(require('./Routes/actividad.routes'))
app.use(require('./Routes/archivo.routes'))
app.use(require('./Routes/comentario.routes'))


app.listen(appPort , () => {
    console.log(`Server listening on port ${appPort}`);
})