//sirve para almacenar las rutas principales

const express = require('express');
const router = express.Router(); //este metodo devuelve un objeto en el que almacenamos las rutas del server
const passport = require('passport');
const mimeTypes = require('mime-types'); //para el mime types
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const Reserva = require('../models/reserva');

router.get('/', (req, res, next) => {
    res.render('index'); //como ya he cofigura do que use ejs y donde esta solo revisa el archivo index.ejs
});


//router.get('/subirvideos', isAuthenticated, (req, res, next) => { //le enviamos a una ventana con el get
  //  res.render('subirvideos');
//});

router.get('/subirvideos', (req, res, next) => { //le enviamos a una ventana con el get
     res.render('subirvideos');
  });

router.post('/subirvideos', (req, res) => {
    console.log('POST')
    let reserva = new Reserva()
    reserva.aula = req.body.aula; //lo que envias del formulario
    reserva.sitio = req.body.sitio;

    reserva.save((err, reservaStored) => {
        if (err) res.status(500).send({message: `Error al salvar en la BD: ${err}`})

        res.status(200).send({product: reservaStored})
    })


   // res.redirect('videos');
});

router.get('/signup', (req, res, next) => { //le enviamos a una ventana con el get
    res.render('signup');
});

router.get('/nosotros', (req, res, next) => { //le enviamos a una ventana con el get
    res.render('nosotros');
});

router.get('/videos', (req, res, next) => { //le enviamos a una ventana con el get
    res.render('videos');
});

router.get('/index', (req, res, next) => { //le enviamos a una ventana con el get
    res.render('index');
});





router.post('/signup', passport.authenticate('local-signup', { //el servidor escucha los datos del usuario con el metodo post
    successRedirect: '/signin',
    failureRedirect: '/signup', //a donde queremos que nos lleve
    passReqToCallback: true
}));

router.get('/signin', (req, res, next) => { //le enviamos a una ventana con el get
    res.render('signin');
});

router.post('/signin', passport.authenticate('local-signin', { //el servidor escucha los datos del usuario con el metodo post
    successRedirect: '/perfil',
    failureRedirect: '/signin', //a donde queremos que nos lleve
    passReqToCallback: true
}));


router.get('/perfil', isAuthenticated, async (req, res, next) => {
    //const videos = await Video.find({user: req.user.id}).lean().sort({date: 'desc'});

    //res.render('perfil', {videos});
    res.render('perfil');
});




router.get('/logout', (req, res, next) => {
    req.logout();
    res.redirect('/');
});

//middleware para autenticar si esta autenticado
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('signin');
    }
};

module.exports = router;