const mongoose = require("mongoose");
const { Schema } = mongoose;

// modelo de la coleccion usuarios
const historialUsuarios = new Schema({
    id_usuario: { type: String },
    id_reproduccion: { type: String },
    nombre_reproduccion: { type: String },
    tipo: { type: String },
    url_reproduccion: { type: String }
}, {
    timestamps: true
});

module.exports = mongoose.model("historialUsuarios", historialUsuarios, "historialUsuarios");