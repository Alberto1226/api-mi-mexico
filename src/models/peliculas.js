const mongoose = require("mongoose");
const { Schema } = mongoose;

// modelo de la coleccion usuarios
const peliculas = new Schema({
    titulo: { type: String },
    genero: { type: String },
    actores: { type: String },
    director: { type: String },
    duracion: { type: String },
    sinopsis: { type: String },
    calificacion: { type: String },
    año: { type: String },
    disponibilidad: { type: String },
    estado: { type: String }
}, {
    timestamps: true
});

module.exports = mongoose.model("peliculas", peliculas, "peliculas");