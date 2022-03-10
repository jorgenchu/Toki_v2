const mongoose = require('mongoose') //para conectarse con mongoose
const { mongodb } = require('./keys') //obtengo prpiedad desde el objeto
    //Para conectarse a la bd
mongoose.connect(mongodb.URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(db => console.log('Se ha conectado a la BD'))
    .catch(err => console.error(err)); //por si hay un error