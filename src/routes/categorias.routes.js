const express = require("express");
const router = express.Router();
const categorias = require("../models/categorias");

// Registro de administradores
router.post("/registro", async (req, res) => {
    const { titulo } = req.body;

    // Inicia validacion para no registrar categorias con el mismo nombre
    const busqueda = await categorias.findOne({ nombre });

    if (busqueda && busqueda.titulo === titulo) {
        return res.status(401).json({ mensaje: "Categoria ya registrado" });
    } else {
        const categoriasRegistrar = categorias(req.body);
        await categoriasRegistrar
            .save()
            .then((data) =>
                res.status(200).json(
                    {
                        mensaje: "Registro exitoso de la categoria", datos: data
                    }
                ))
            .catch((error) => res.json({ message: error }));
    }
});

// Obtener todas las categorias
router.get("/listar", async (req, res) => {
    categorias
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

    await categorias
        .find({ estado: "true" })
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limite)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el total de las ventas activas
router.get("/totalCategoriasActivas", async (_req, res) => {
    await categorias
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

    await categorias
        .find({ estado: "false" })
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limite)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el total de las ventas canceladas
router.get("/totalCategoriasCancelados", async (_req, res) => {
    await categorias
        .find({ estado: "false" })
        .count()
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Listar paginando las categorias
router.get("/listarPaginando", async (req, res) => {
    const { pagina, limite } = req.query;
    //console.log("Pagina ", pagina , " Limite ", limite)

    const skip = (pagina - 1) * limite;

    await categorias
        .find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limite)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener una categoria en especifico
router.get("/obtenerCategorias/:id", async (req, res) => {
    const { id } = req.params;
    //console.log("buscando")
    categorias
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Borrar una categoria
router.delete("/eliminar/:id", async (req, res) => {
    const { id } = req.params;
    categorias
        .deleteOne({ _id: id })
        .then((data) => res.status(200).json({ mensaje: "Categoria eliminada" }))
        .catch((error) => res.json({ message: error }));
});

// Cambiar estado la categoria
router.put("/deshabilitar/:id", async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;
    categorias
        .updateOne({ _id: id }, { $set: { estado } })
        .then((data) => res.status(200).json({ mensaje: "Estado de la categoria actualizado" }))
        .catch((error) => res.json({ message: error }));
});

// Actualizar datos de la categoria
router.put("/actualizar/:id", async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, estado } = req.body;

    // Inicia validacion para no registrar categoias con el mismo correo electronico
    const busqueda = await categorias.findOne({ nombre });

    if (busqueda && busqueda.titulo === titulo && busqueda._id != id) {
        return res.status(401).json({ mensaje: "Categoria ya registrada" });
    } else {
        await categorias
            .updateOne({ _id: id }, { $set: { nombre, descripcion, estado } })
            .then((data) => res.status(200).json({ mensaje: "Datos de la categoria actualizados" }))
            .catch((error) => res.json({ message: error }));
    }
});

module.exports = router;
