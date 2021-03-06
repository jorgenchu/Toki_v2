//sirve para almacenar las rutas principales

const express = require('express');
const router = express.Router(); //este metodo devuelve un objeto en el que almacenamos las rutas del server
const passport = require('passport');
const mimeTypes = require('mime-types'); //para el mime types
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const Reserva = require('../models/reserva');
const User = require('../models/user');
const Res = require('../models/reserva');
//const { db } = require('../models/user');
const user = require('../models/user');
const reserva = require('../models/reserva');
const querystring = require('querystring');

router.get('/', (req, res, next) => {
    res.render('index'); //como ya he cofigura do que use ejs y donde esta solo revisa el archivo index.ejs
});


//router.get('/subirvideos', isAuthenticated, (req, res, next) => { //le enviamos a una ventana con el get
  //  res.render('subirvideos');
//});

router.get('/subirvideos',  isAuthenticated, async(req, res, next) => { //le enviamos a una ventana con el get
    
    res.render('subirvideos');
  });

router.post('/subirvideos',async (req, res, done) => {
    console.log('Realizando reserva')
    var place = req.body.sitio;
    var room = req.body.aula;
    var date = req.body.fecha;
    Res.findOne({aula : room, sitio : place, fecha : date}, function (err, rese) {
      if (err) return console.error(err);
       // will return a json array of all the documents in the collection
      console.log(rese); 
      if (rese != null) {
        console.log('Sitio reservado')
        res.send("SITIO RESERVADO")
        req.flash('resMensagge', 'Sitio reservado');

    } else {
        let newReserva = new Reserva()
        newReserva.aula = req.body.aula; //lo que envias del formulario
        newReserva.sitio = req.body.sitio;
        newReserva.user = req.user.id;
        newReserva.fecha = req.body.fecha;
        newReserva.save((err, reservaStored) => {
            if (err) res.status(500).send({message: `Error al salvar en la BD: ${err}`})
            //res.status(200).send({product: reservaStored})
        })
       
    }
     res.redirect("reservas");   
  
})
    
});




router.get('/signup', (req, res, next) => { //le enviamos a una ventana con el get
    res.render('signup');
});

router.get('/nosotros', (req, res, next) => { //le enviamos a una ventana con el get
    res.render('nosotros');
});

router.get('/qr',isAuthenticated, async (req, res, next) => { //le enviamos a una ventana con el get
    let id = req.query.id;
    

    const reservas = await Res.find({reserva: req.params.id, });
    console.log(reservas)
    res.render('qr', {reservas});

});

router.get('/reservas', isAuthenticated, async (req, res, next) => { //le enviamos a una ventana con el get
    const id = req.user.id; 
    const reservas = await Res.find({user: req.user.id}).lean().sort({date: 'desc'});
    res.render('reservas', {reservas});
});

router.get('/index', (req, res, next) => { //le enviamos a una ventana con el get
    res.render('index');
});

router.get('/reservaselim', isAuthenticated, async (req, res) => {
    const id = req.user.id; 
    const reservas = await Res.find({user: req.user.id}).lean().sort({date: 'desc'});
    res.render('reservaselim', {reservas});
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
    
    const id = req.user.id; 
    const reservas = await Res.find({user: req.user.id}).lean().sort({date: 'desc'});
    res.render('perfil', {reservas});
});

router.get('/reserva', async (req, res) => {
    const reserv = await Res.find().sort('-_id');
    res.json(reserv);
});


router.delete('/reserva/:id', async (req, res) => {
    const reserv = await Res.findByIdAndDelete(req.params.id);
    res.json({message: 'Reserva deleted'});
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