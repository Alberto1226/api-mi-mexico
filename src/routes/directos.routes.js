const express = require("express");
const router = express.Router();
const directos = require("../models/directos");

// Registro de administradores
router.post("/registro", async (req, res) => {

    const directoRegistrar = directos(req.body);
    await directoRegistrar
        .save()
        .then((data) =>
            res.status(200).json(
                {
                    mensaje: "Registro exitoso del directo", datos: data
                }
            ))
        .catch((error) => res.json({ message: error }));
});

// Obtener todos los directos colaboradores
router.get("/listar", async (req, res) => {
    directos
        .find()
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener un directos en especifico
router.get("/obtener/:id", async (req, res) => {
    const { id } = req.params;
    //console.log("buscando")
    directos
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Borrar un directo administrador
router.delete("/eliminar/:id", async (req, res) => {
    const { id } = req.params;
    directos
        .deleteOne({ _id: id })
        .then((data) => res.status(200).json({ mensaje: "Directo eliminado" }))
        .catch((error) => res.json({ message: error }));
});

// Cambiar estado del directo
router.put("/deshabilitar/:id", async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    directos
        .updateOne({ _id: id }, { $set: { status } })
        .then((data) => res.status(200).json({ mensaje: "Estado del directo actualizado" }))
        .catch((error) => res.json({ message: error }));
});

// Actualizar datos del directo
router.put("/actualizar/:id", async (req, res) => {
    const { id } = req.params;

        await directos
            .updateOne({ _id: id }, { $set: { codigo } })
            .then((data) => res.status(200).json({ mensaje: "Datos del directo actualizados" }))
            .catch((error) => res.json({ message: error }));
});

module.exports = router;
