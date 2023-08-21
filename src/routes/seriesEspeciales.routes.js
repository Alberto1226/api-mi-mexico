const express = require("express");
const router = express.Router();
const series = require("../models/seriesEspeciales");
const multer = require("multer");
const path = require("path");

// Registro de administradores
router.post("/registro", async (req, res) => {
    const { titulo } = req.body;

    // Inicia validacion para no registrar series con el mismo correo electronico
    const busqueda = await series.findOne({ titulo });

    if (busqueda && busqueda.titulo === titulo) {
        return res.status(401).json({ mensaje: "Serie ya registrada" });
    } else {
        const seriesRegistrar = series(req.body);
        await seriesRegistrar
            .save()
            .then((data) =>
                res.status(200).json(
                    {
                        mensaje: "Registro exitoso de la serie", datos: data
                    }
                ))
            .catch((error) => res.json({ message: error }));
    }
});

// Obtener todos las series colaboradores
router.get("/listar", async (req, res) => {
    series
        .find()
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener todos las series colaboradores
router.get("/listarSeriesMasVistas", async (req, res) => {
    series
        .find()
        .sort({ contador: -1 })
        .limit(10)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener las ventas activas con paginacion
router.get("/listarPaginandoActivos", async (req, res) => {
    const { pagina, limite } = req.query;
    //console.log("Pagina ", pagina , " Limite ", limite)

    const skip = (pagina - 1) * limite;

    await series
        .find({ tipo: "interno", estado: "true" })
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limite)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el total de las ventas activas
router.get("/totalSeriesActivas", async (_req, res) => {
    await series
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

    await series
        .find({ estado: "false" })
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limite)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el total de las ventas canceladas
router.get("/totalSeriesCancelados", async (_req, res) => {
    await series
        .find({ estado: "false" })
        .count()
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Listar paginando las series
router.get("/listarPaginando", async (req, res) => {
    const { pagina, limite } = req.query;
    //console.log("Pagina ", pagina , " Limite ", limite)

    const skip = (pagina - 1) * limite;

    await series
        .find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limite)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener una serie en especifico
router.get("/obtenerSerie/:id", async (req, res) => {
    const { id } = req.params;
    //console.log("buscando")
    series
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Borrar una serie
router.delete("/eliminar/:id", async (req, res) => {
    const { id } = req.params;
    series
        .deleteOne({ _id: id })
        .then((data) => res.status(200).json({ mensaje: "Serie eliminada" }))
        .catch((error) => res.json({ message: error }));
});

// Cambiar estado la serie
router.put("/deshabilitar/:id", async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;
    series
        .updateOne({ _id: id }, { $set: { estado } })
        .then((data) => res.status(200).json({ mensaje: "Estado de la serie actualizado" }))
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

// Actualizar datos de la serie
router.put("/actualizar/:id", async (req, res) => {
    const { id } = req.params;
    const { titulo, genero, actores, urlPortada, urlPortada2, urlPortada3, urlPortada4, urlPortada5, urlTrailer, director, duracion, header, sinopsis, calificacion, datos, temporada, año, disponibilidad, patrocinador } = req.body;
    await series
        .updateOne({ _id: id }, { $set: { titulo, genero, urlPortada, urlPortada2, urlPortada3, urlPortada4, urlPortada5, urlTrailer, actores, header, director, duracion, sinopsis, calificacion, datos, temporada, año, disponibilidad, patrocinador } })
        .then((data) => res.status(200).json({ mensaje: "Datos de la serie actualizados" }))
        .catch((error) => res.json({ message: error }));
});

// Obtener todos las series colaboradores
router.get("/listarUltimosCincoEspeciales", async (req, res) => {
    const { tipo } = req.query;
    series
        .find()
        .sort({ createdAt: -1})
        .limit(1)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

const destinationFolder = "/Users/josedavidayalafranco3/Documents/cancun/mi-mexico/src/assets/capitulos";

const upload = multer({
    dest: destinationFolder,
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, destinationFolder);
        },
        filename: (req, file, cb) => {
            const ext = path.extname(file.originalname);
            cb(null, `video-${Date.now()}${ext}`);
        },
    }),
});

router.post('/upload', upload.single('video'), (req, res) => {
    const videoPath = req.file.path;
    res.json({ videoPath });
});

module.exports = router;
