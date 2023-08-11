const mongoose = require("mongoose");
const { Schema } = mongoose;

// modelo de la coleccion usuarios
const seriesEspeciales = new Schema({
    titulo: { type: String },
    categorias: { type: Array, default: [] },
    actores: { type: String },
    director: { type: String },
    duracion: { type: String },
    sinopsis: { type: String },
    calificacion: { type: String },
    datosTemporada: { type: Array, default: [] },
    año: { type: String },
    disponibilidad: { type: String },
    masVisto: { type: String },
    header: { type: String },
    recomendado: { type: String },
    urlPortada: { type: String },
    urlTrailer: { type: String },
    contador: { type: String },
    seccion: { type: String },
    estado: { type: String },
    urlPortada2: { type: String },
    urlPortada3: { type: String },
    urlPortada4: { type: String },
    urlPortada5: { type: String },
}, {
    timestamps: true
});

module.exports = mongoose.model("seriesEspeciales", seriesEspeciales, "seriesEspeciales");