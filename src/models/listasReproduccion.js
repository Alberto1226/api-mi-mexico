const mongoose = require("mongoose");
const { Schema } = mongoose;

// modelo de la coleccion usuarios
const listasReproduccion = new Schema({
    titulo: { type: String },
    descripcion: { type: String },
    peliculas: { type: Array, default: [] },
    estado: { type: String }
}, {
    timestamps: true
});

module.exports = mongoose.model("listasReproduccion", listasReproduccion, "listasReproduccion");