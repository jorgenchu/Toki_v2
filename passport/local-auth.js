const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user'); //para acceder a users(guardar clave y verificar)//gracias a user podemos crear nuevos usarios

passport.serializeUser((user, done) => { //guarda el registro en un archivo para no tener que ingresar el usuario en cada pagina
    done(null, user.id)
});

passport.deserializeUser(async(id, done) => { //
    const user = await User.findById(id); //consulta a base de datos mediante id
    done(null, user); //devulve el id

});

//cada vez que viaje a una pagina me da el id y lo busca en la base de datos la repeticion lo hace el metodo de abajo

passport.use('local-signup', new LocalStrategy({   //crea el usuario
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async(req, email, password, done) => {
    const user = await User.findOne({'email': email })   //comprueba si el usuario se ha creado previamente
    console.log(user)
    if (user) {
        return done(null, false, req.flash('signupMessage', 'El email esta registrado'));
    } else {
        const newUser = new User();
        newUser.nickname = req.body.nickname;
        newUser.email = email;
        newUser.password = newUser.encryptPassword(password);
        console.log(newUser)
        await newUser.save(); //esperar a que se guarde antes de seguir a la siguiente línea
        done(null, newUser);
    }
}));
//el req es por si le pides más datos almacenarlo junto con el correo y la contraseña
//done es un callback, una vez que termine el proceso le devuelve respuesta al cliente


passport.use('local-signin', new LocalStrategy({     //verifica 
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async(req, email, password, done) => { 
    const user = await User.findOne({ 'email': email }); //comprueba que no exista el usuario
    if (!user) {
        return done(null, false, req.flash('signinMessage', 'No se han encontrado usuarios'));
    }
    if (!user.comparePassword(password)) {
        return done(null, false, req.flash('signinMessage', 'Contraseña incorrecta'));
    }
    return done(null, user);
}));