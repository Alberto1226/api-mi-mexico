const express = require("express");
const router = express.Router();
const patrocinadores = require("../models/patrocinadores");

// Registro de administradores
router.post("/registro", async (req, res) => {
    const { titulo } = req.body;

    // Inicia validacion para no registrar patrocinadores con el mismo nombre
    const busqueda = await patrocinadores.findOne({ nombre });

    if (busqueda && busqueda.titulo === titulo) {
        return res.status(401).json({ mensaje: "Patrocinador ya registrado" });
    } else {
        const patrocinadoresRegistrar = patrocinadores(req.body);
        await patrocinadoresRegistrar
            .save()
            .then((data) =>
                res.status(200).json(
                    {
                        mensaje: "Registro exitoso del patrocinador", datos: data
                    }
                ))
            .catch((error) => res.json({ message: error }));
    }
});

// Obtener todas los patrocionadores
router.get("/listar", async (req, res) => {
    patrocinadores
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

    await patrocinadores
        .find({ estado: "true" })
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limite)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el total de las ventas activas
router.get("/totalPatrocionadoresActivas", async (_req, res) => {
    await patrocinadores
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

    await patrocinadores
        .find({ estado: "false" })
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limite)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el total de las ventas canceladas
router.get("/totalPatrocionadoresCancelados", async (_req, res) => {
    await patrocinadores
        .find({ estado: "false" })
        .count()
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Listar paginando los patrocionadores
router.get("/listarPaginando", async (req, res) => {
    const { pagina, limite } = req.query;
    //console.log("Pagina ", pagina , " Limite ", limite)

    const skip = (pagina - 1) * limite;

    await patrocinadores
        .find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limite)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener un patrocionador en especifico
router.get("/obtenerPatrocinador/:id", async (req, res) => {
    const { id } = req.params;
    //console.log("buscando")
    patrocinadores
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Borrar una patrocinador
router.delete("/eliminar/:id", async (req, res) => {
    const { id } = req.params;
    patrocinadores
        .deleteOne({ _id: id })
        .then((data) => res.status(200).json({ mensaje: "Patrocinador eliminada" }))
        .catch((error) => res.json({ message: error }));
});

// Cambiar estado la patrocinador
router.put("/deshabilitar/:id", async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;
    patrocinadores
        .updateOne({ _id: id }, { $set: { estado } })
        .then((data) => res.status(200).json({ mensaje: "Estado del patrocinador actualizado" }))
        .catch((error) => res.json({ message: error }));
});

// Actualizar datos de la patrocinador
router.put("/actualizar/:id", async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, estado } = req.body;

    // Inicia validacion para no registrar categoias con el mismo correo electronico
    const busqueda = await patrocinadores.findOne({ nombre });

    if (busqueda && busqueda.titulo === titulo && busqueda._id != id) {
        return res.status(401).json({ mensaje: "Patrocinador ya registrada" });
    } else {
        await patrocinadores
            .updateOne({ _id: id }, { $set: { nombre, descripcion, estado } })
            .then((data) => res.status(200).json({ mensaje: "Datos del patrocinador actualizados" }))
            .catch((error) => res.json({ message: error }));
    }
});

module.exports = router;
