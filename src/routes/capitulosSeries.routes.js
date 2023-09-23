const express = require("express");
const router = express.Router();
const capitulosSeries = require("../models/capitulosSeries");

// Registro de administradores
router.post("/registro", async (req, res) => {

    const capitulosRegistrar = capitulosSeries(req.body);
    await capitulosRegistrar
        .save()
        .then((data) =>
            res.status(200).json(
                {
                    mensaje: "Registro exitoso del capitulo", datos: data
                }
            ))
        .catch((error) => res.json({ message: error }));
});

// Obtener todas las capitulos series 
router.get("/listar", async (req, res) => {
    const { serie } = req.query;
    capitulosSeries
        .find({ serie })
        .sort({ temporada: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener las ventas activas con paginacion
router.get("/listarPaginandoActivos", async (req, res) => {
    const { pagina, limite } = req.query;
    //console.log("Pagina ", pagina , " Limite ", limite)

    const skip = (pagina - 1) * limite;

    await capitulosSeries
        .find({ estado: "true" })
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limite)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el total de las ventas activas
router.get("/totalCapitulosActivas", async (_req, res) => {
    await capitulosSeries
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

    await capitulosSeries
        .find({ estado: "false" })
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limite)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el total de las ventas canceladas
router.get("/totalCapitulosCancelados", async (_req, res) => {
    await capitulosSeries
        .find({ estado: "false" })
        .count()
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Listar paginando las capitulos series
router.get("/listarPaginando", async (req, res) => {
    const { pagina, limite } = req.query;
    //console.log("Pagina ", pagina , " Limite ", limite)

    const skip = (pagina - 1) * limite;

    await capitulosSeries
        .find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limite)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener una capitulo en especifico
router.get("/obtenerCapitulos/:id", async (req, res) => {
    const { id } = req.params;
    //console.log("buscando")
    capitulosSeries
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Borrar una capitulo
router.delete("/eliminar/:id", async (req, res) => {
    const { id } = req.params;
    capitulosSeries
        .deleteOne({ _id: id })
        .then((data) => res.status(200).json({ mensaje: "Capitulo eliminado" }))
        .catch((error) => res.json({ message: error }));
});

// Cambiar estado la capitulo
router.put("/deshabilitar/:id", async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;
    capitulosSeries
        .updateOne({ _id: id }, { $set: { estado } })
        .then((data) => res.status(200).json({ mensaje: "Estado del capitulo actualizado" }))
        .catch((error) => res.json({ message: error }));
});

// Actualizar datos de la capitulo
router.put("/actualizar/:id", async (req, res) => {
    const { id } = req.params;
    const { nombre, urlCapitulo, urlPortada, duracion, descripcion, urlPortadaMovil } = req.body;

    await capitulosSeries
        .updateOne({ _id: id }, { $set: { nombre, urlCapitulo, urlPortada, duracion, descripcion, urlPortadaMovil } })
        .then((data) => res.status(200).json({ mensaje: "Datos del capitulo actualizados" }))
        .catch((error) => res.json({ message: error }));
});

// Actualizar datos de la serie
router.put("/actualizarContador/:id", async (req, res) => {
    const { id } = req.params;
    const { contador } = req.body;

    await series
        .updateOne({ _id: id }, { $set: { contador } })
        .then((data) => res.status(200).json({ mensaje: "Datos de la serie actualizados" }))
        .catch((error) => res.json({ message: error }));
});
module.exports = router;
