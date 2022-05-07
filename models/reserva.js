const { Int32 } = require('mongodb');
const mongoose = require('mongoose');
const user = require('./user');
const Schema = mongoose.Schema

const ReservaSchema = new Schema({
    id: Number,
    aula: Number,
    sitio: Number,
    user: String,
    fecha: { type: Date }
});

module.exports = mongoose.model('Reserva', ReservaSchema)