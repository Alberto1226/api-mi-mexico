const mongoose = require("mongoose");
const { Schema } = mongoose;

// modelo de la coleccion usuarios
const series = new Schema({
    titulo: { type: String },
    genero: { type: String },
    actores: { type: String },
    director: { type: String },
    duracion: { type: String },
    sinopsis: { type: String },
    calificacion: { type: String },
    datosTemporada: {type: Array, default: []},
    año: { type: String },
    disponibilidad: { type: String },
    estado: { type: String }
}, {
    timestamps: true
});

module.exports = mongoose.model("series", series, "series");