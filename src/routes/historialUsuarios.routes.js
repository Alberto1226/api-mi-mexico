const express = require("express");
const router = express.Router();
const historialUsuarios = require("../models/historialUsuarios");

// Registro de administradores
router.post("/registro", async (req, res) => {

    const historialRegistrar = historialUsuarios(req.body);
    await historialRegistrar
        .save()
        .then((data) =>
            res.status(200).json(
                {
                    mensaje: "Registro exitoso del historial del usuario", datos: data
                }
            ))
        .catch((error) => res.json({ message: error }));
});

// Obtener todas los registros
router.get("/listar", async (req, res) => {
    historialUsuarios
        .find()
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener las ventas activas con paginacion
router.get("/listarPaginandoActivos", async (req, res) => {
    const { pagina, limite } = req.query;
    //console.log("Pagina ", pagina , " Limite ", limite)

    const skip = (pagina - 1) * limite;

    await historialUsuarios
        .find({ estado: "true" })
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limite)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el total de las ventas activas
router.get("/totalRegistrosActivas", async (_req, res) => {
    await historialUsuarios
        .find({ estado: "true" })
        .count()
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener las ventas canceladas con paginacion
router.get("/listarPaginandoCancelados", async (req, res) => {
    const { pagina, limite } = req.query;
    //console.log("Pagina ", pagina , " Limite ", limite)

    const skip = (pagina - 1) * limite;

    await historialUsuarios
        .find({ estado: "false" })
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limite)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el total de las ventas canceladas
router.get("/totalRegistrosCancelados", async (_req, res) => {
    await historialUsuarios
        .find({ estado: "false" })
        .count()
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Listar paginando las c
router.get("/listarPaginando", async (req, res) => {
    const { pagina, limite } = req.query;
    //console.log("Pagina ", pagina , " Limite ", limite)

    const skip = (pagina - 1) * limite;

    await historialUsuarios
        .find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limite)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener un registro en especifico
router.get("/obtenerRegistros/:id", async (req, res) => {
    const { id } = req.params;
    //console.log("buscando")
    historialUsuarios
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Borrar un registro
router.delete("/eliminar/:id", async (req, res) => {
    const { id } = req.params;
    historialUsuarios
        .deleteOne({ _id: id })
        .then((data) => res.status(200).json({ mensaje: "Registro eliminado" }))
        .catch((error) => res.json({ message: error }));
});

// Cambiar estado del registro
router.put("/deshabilitar/:id", async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;
    historialUsuarios
        .updateOne({ _id: id }, { $set: { estado } })
        .then((data) => res.status(200).json({ mensaje: "Estado del registro actualizado" }))
        .catch((error) => res.json({ message: error }));
});

// Actualizar datos del registro
router.put("/actualizar/:id", async (req, res) => {
    const { id } = req.params;
    const { id_usuario, id_reproduccion, nombre_reproduccio, tipo, url_reproduccion } = req.body;

    await historialUsuarios
        .updateOne({ _id: id }, { $set: {id_usuario, id_reproduccion, nombre_reproduccio, tipo, url_reproduccion } })
        .then((data) => res.status(200).json({ mensaje: "Datos del registro actualizados" }))
        .catch((error) => res.json({ message: error }));
});

module.exports = router;
