const express = require("express");
const router = express.Router();
const listasReproduccion = require("../models/listasReproduccion");

// Registro de administradores
router.post("/registro", async (req, res) => {
    const { titulo } = req.body;

    // Inicia validacion para no registrar lista de reproduccion con el mismo correo electronico
    const busqueda = await listasReproduccion.findOne({ titulo });

    if (busqueda && busqueda.titulo === titulo) {
        return res.status(401).json({ mensaje: "Lista de reproduccion ya registrado" });
    } else {
        const listasReproduccionRegistrar = listasReproduccion(req.body);
        await listasReproduccionRegistrar
            .save()
            .then((data) =>
                res.status(200).json(
                    {
                        mensaje: "Registro exitoso de la lista de reproduccion", datos: data
                    }
                ))
            .catch((error) => res.json({ message: error }));
    }
});

// Obtener todas las listas de reproduccion
router.get("/listar", async (req, res) => {
    listasReproduccion
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

    await listasReproduccion
        .find({ tipo: "interno", estado: "true" })
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limite)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el total de las ventas activas
router.get("/totalListasReproduccionActivas", async (_req, res) => {
    await listasReproduccion
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

    await listasReproduccion
        .find({ estado: "false" })
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limite)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el total de las ventas canceladas
router.get("/totalListasReproduccionCancelados", async (_req, res) => {
    await listasReproduccion
        .find({ estado: "false" })
        .count()
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Listar paginando las listas de reproduccion
router.get("/listarPaginando", async (req, res) => {
    const { pagina, limite } = req.query;
    //console.log("Pagina ", pagina , " Limite ", limite)

    const skip = (pagina - 1) * limite;

    await listasReproduccion
        .find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limite)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener una lista de reproduccion en especifico
router.get("/obtenerListasReproduccion/:id", async (req, res) => {
    const { id } = req.params;
    //console.log("buscando")
    listasReproduccion
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Borrar una lista de reproduccion
router.delete("/eliminar/:id", async (req, res) => {
    const { id } = req.params;
    listasReproduccion
        .deleteOne({ _id: id })
        .then((data) => res.status(200).json({ mensaje: "Lista de reproduccion eliminada" }))
        .catch((error) => res.json({ message: error }));
});

// Cambiar estado la lista de reproduccion
router.put("/deshabilitar/:id", async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;
    listasReproduccion
        .updateOne({ _id: id }, { $set: { estado } })
        .then((data) => res.status(200).json({ mensaje: "Estado de la lista de reproduccion actualizado" }))
        .catch((error) => res.json({ message: error }));
});

// Actualizar datos de la listas de reproduccion
router.put("/actualizar/:id", async (req, res) => {
    const { id } = req.params;
    const { titulo, descripcion, peliculas } = req.body;

    // Inicia validacion para no registrar listas de reproduccion con el mismo correo electronico
    const busqueda = await listasReproduccion.findOne({ titulo });

    if (busqueda && busqueda.titulo === titulo && busqueda._id != id) {
        return res.status(401).json({ mensaje: "Lista de reproduccion ya registrada" });
    } else {
        await listasReproduccion
            .updateOne({ _id: id }, { $set: { titulo, descripcion, peliculas } })
            .then((data) => res.status(200).json({ mensaje: "Datos de la lista de reproduccion actualizados" }))
            .catch((error) => res.json({ message: error }));
    }
});

module.exports = router;
