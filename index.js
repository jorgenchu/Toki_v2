//Creacion del servidor web


const express = require('express'); 
const engine = require('ejs-mate') //para crear las plantillas
const path = require('path') //rutas
const morgan = require('morgan') //para vre desde consola los archivos que se solicitan
const passport = require('passport');
const multer = require('multer');
const session = require('express-session'); //para almacenar una sesion
const flash = require('connect-flash') //para enviar mensajes entre multiplkes paginas
const uuid = require('uuid'); //asigna el id

//Inicializaciones
const app = express();
require('./database');
require('./passport/local-auth');


//settings 
//app.set('public', path.join(__dirname, 'public')) //para que sepa donde esta views(que esta dentro de src) //path concatena dos rutas  //dirname te devuelve la direccion del archivo que se ejecutaa 
app.engine('ejs', engine) // para usar el motor de plantillas
app.set('view engine', 'ejs');
const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));
app.set('port', process.env.PORT || 3000); //process.env.PORT si no usa el puerto que te da el servicio utiliza el 3000


//middlewares => Funciones que se ejecutan antes de que pasen a las rutas (ejmplo aprocesar datos antes de que vaya a la ruta)
//app.use(express.static('/public'));
app.use(morgan('dev')); //dev da informacion breve en consola
app.use(express.urlencoded({ extended: false })); //este método lo que nos permite es poder recibir los datos desde el cliente //con exteded: false indica que solo datos
const storage = multer.diskStorage({ //como se va guardar los videos, con que nombre
    destination: path.join(__dirname, 'publico/videos/uploads'),
    filename: (req, file, cb, filename) => {
        cb(null, uuid.v4() + path.extname(file.originalname));
    }
});
app.use(multer({ storage: storage }).single('video')); //le pasa los archivos a storage que se encarga de guardarlo
app.use(session({
    secret: 'mysecretsession',
    resave: false,
    saveUninitialized: false //para decirle que no hace falta inicializacion previa
}))
app.use(flash()); //flash hace uso de sesiones
app.use(passport.initialize());
app.use(passport.session()); //para almacenar en una sesion(archivo dentro de la sesion), hay que declararlo con express-session

app.use((req, res, next) => {
    app.locals.signupMessage = req.flash('signupMessage');
    app.locals.signinMessage = req.flash('signinMessage'); //para tener el mensaje dessde cualquier lado//siino tiene mensaje devuelve un null
    app.locals.user = req.user; //almacena los datos que trae de req.user
  

    next(); //para que continue con el restro de las rutas
});



//Routes (Para que use la hoja de rutas)
app.use('/', require('./routes/index.js')); //cada vez que ingrese al raiz utiliza esa rutas





app.listen(3000, () => console.log("Servidor escuchando en 3000")); //servidor escuchando