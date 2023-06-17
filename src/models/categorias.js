const mongoose = require("mongoose");
const { Schema } = mongoose;

// modelo de la coleccion usuarios
const categorias = new Schema({
    nombre: { type: String },
    descripcion: { type: String },
    estado: { type: String }
}, {
    timestamps: true
});

module.exports = mongoose.model("categorias", categorias, "categorias");