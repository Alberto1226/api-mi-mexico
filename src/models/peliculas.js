const mongoose = require("mongoose");
const { Schema } = mongoose;

// modelo de la coleccion usuarios
const peliculas = new Schema({
    titulo: { type: String },
    categorias: { type: Array, default: [] },
    actores: { type: String },
    director: { type: String },
    duracion: { type: String },
    sinopsis: { type: String },
    calificacion: { type: String },
    año: { type: String },
    disponibilidad: { type: String },
    masVisto: {type: String},
    recomendado: {type: String},
    urlVideo: {type: String},
    urlPortada: {type: String},
    seccion: {type: String},
    estado: { type: String }
}, {
    timestamps: true
});

module.exports = mongoose.model("peliculas", peliculas, "peliculas");