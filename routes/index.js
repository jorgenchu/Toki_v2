//sirve para almacenar las rutas principales

const express = require('express');
const router = express.Router(); //este metodo devuelve un objeto en el que almacenamos las rutas del server
const passport = require('passport');
const multer = require('multer');
const mimeTypes = require('mime-types'); //para el mime types


const Video = require('../models/video');

router.get('/', (req, res, next) => {
    res.render('index'); //como ya he cofigura do que use ejs y donde esta solo revisa el archivo index.ejs
});


router.get('/subirvideos', isAuthenticated, (req, res, next) => { //le enviamos a una ventana con el get
    res.render('subirvideos');
});

router.post('/subirvideos', async(req, res) => {
    const video = new Video();
    video.title = req.body.title; //lo que envias del formulario
    video.description = req.body.description;
    video.filename = req.file.filename;
    video.path = '/videos/uploads/' + req.file.filename; //ruta del archivo dentro de subirvideos
    video.mimetype = req.file.mimetype;
    video.size = req.file.size;
    video.user=req.user.id;

    await video.save();

    console.log(video);

    res.redirect('videos');
});


router.get('/video/:id', (req, res) => {
    res.send('video Profile');
});



router.get('/video/:id/delete', (req, res) => { //para borrar la imagen seria video/1/delete y borra video con id 1
    res.send('Video deleted');
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
    const videos = await Video.find({user: req.user.id}).lean().sort({date: 'desc'});

    res.render('perfil', {videos});
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