const mongoose = require("mongoose");
const { Schema } = mongoose;

// modelo de la coleccion usuarios
const capitulosSeries = new Schema({
    serie: { type: String },
    temporada: { type: String },
    nombre: { type: String },
    urlCapitulo: { type: String },
    urlPortada: { type: String },
    duracion: { type: String },
    descripcion: { type: String },
    estado: { type: String },
    urlPortadaMovil: { type: String },
    contador: { type: String },
}, {
    timestamps: true
});

module.exports = mongoose.model("capitulosSeries", capitulosSeries, "capitulosSeries");