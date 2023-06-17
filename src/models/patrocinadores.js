const mongoose = require("mongoose");
const { Schema } = mongoose;

// modelo de la coleccion usuarios
const patrocinadores = new Schema({
    nombre: { type: String },
    urlImagen: { type: String },
    urlWeb: { type: String },
    urlFacebook: { type: String },
    urlInstagram: { type: String },
    urlTwitter: { type: String },
    estado: { type: String }
}, {
    timestamps: true
});

module.exports = mongoose.model("patrocinadores", patrocinadores, "patrocinadores");