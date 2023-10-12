const mongoose = require("mongoose");
const { Schema } = mongoose;

// modelo de la coleccion usuarios
const directos = new Schema({
    codigo: { type: String },
    status: { type: String },
}, {
    timestamps: true
});

module.exports = mongoose.model("directos", directos, "directos");