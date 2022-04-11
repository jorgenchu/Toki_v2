const { Int32 } = require('mongodb');
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ReservaSchema = new Schema({
    aula: Number,
    sitio: Number,
    reserved_at: { type: Date, default: Date.now() }
});

module.exports = mongoose.model('Reserva', ReservaSchema)