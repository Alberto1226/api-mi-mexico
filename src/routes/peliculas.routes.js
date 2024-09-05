const express = require("express");
const router = express.Router();
const peliculas = require("../models/peliculas");
const multer = require("multer");
const path = require("path");
const { map } = require("lodash");
const axios = require('axios');
const fs = require('fs');
const tus = require('tus-js-client');

const apiToken = 'BTzRk131MuwEQC879I1ZY4mI62IwiQzmXVNYuEvT'; // Token de API
const acounid ='476c92bc94b52dc51a8b504fb0a48185';
// Configura multer para almacenar el archivo en memoria
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

function uploadFileToCloudflare(fileBuffer, fileName, fileSize, accountId, apiToken) {
    return new Promise((resolve, reject) => {
        const options = {
            endpoint: `https://api.cloudflare.com/client/v4/accounts/${accountId}/stream`,
            headers: {
                Authorization: `Bearer ${apiToken}`,
            },
            chunkSize: 50 * 1024 * 1024, // Tamaño del chunk de 50MB
            retryDelays: [0, 3000, 5000, 10000, 20000],
            metadata: {
                name: fileName, // Nombre del archivo
                filetype: "video/mp4",
            },
            uploadSize: fileSize,
            onError: function (error) {
                reject(error);
            },
            onProgress: function (bytesUploaded, bytesTotal) {
                const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
                console.log(`Progreso: ${percentage}% (${bytesUploaded}/${bytesTotal} bytes)`);
            },
            onSuccess: function () {
                console.log("Carga finalizada con éxito");
            },
            onAfterResponse: function (req, res) {
                const mediaIdHeader = res.getHeader("stream-media-id");
                if (mediaIdHeader) {
                    console.log("ID del media cargado:", mediaIdHeader);
                    resolve(mediaIdHeader);
                } else {
                    resolve(null);
                }
            },
        };

        const upload = new tus.Upload(fileBuffer, options);
        upload.start();
    });
}




router.post('/hola', upload.single('file'), async (req, res) => {
    console.log("Request received: /hola");

    if (!req.file) {
        return res.status(400).json({ message: 'No se ha enviado ningún archivo.' });
    }

    try {
        const fileBuffer = req.file.buffer; // Buffer del archivo
        const fileName = req.file.originalname; // Nombre del archivo
        const fileSize = req.file.size; // Tamaño del archivo

        console.log("Subiendo archivo a Cloudflare Stream...");
        const vid = await uploadFileToCloudflare(fileBuffer, fileName, fileSize, acounid, apiToken);

        console.log("Archivo subido exitosamente.");
        res.status(200).json({ message: 'Archivo subido exitosamente.', url: vid, bien: "bien" });
    } catch (err) {
        console.error("Error en la carga:", err); // Logging detallado del error
        res.status(500).json({ message: err.message });
    }
});



// Ruta para subir el video
// Ruta para subir el video
router.post('/uploadVideo', upload.single('video'), async (req, res) => {
    console.log("Request body:", req.body); // Muestra el contenido del cuerpo de la solicitud
    console.log("Request file:", req.file); // Muestra información sobre el archivo subido
    
    if (!req.file) {
      return res.status(400).json({ message: 'Por favor, selecciona un archivo de video.' });
    }
  
    try {
      // Solicita una URL de carga directa con los parámetros necesarios
      console.log("Solicitando URL de carga directa...");
      
      const presignedUrlResponse = await axios.post(
        'https://api.cloudflare.com/client/v4/accounts/476c92bc94b52dc51a8b504fb0a48185/stream/direct_upload',
        {
          maxDurationSeconds: 3600, // Duración máxima permitida en segundos
        },
        {
          headers: {
            Authorization: `Bearer ${apiToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      const { uploadURL } = presignedUrlResponse.data.result;
      console.log("Presigned URL obtenida:", uploadURL); // Muestra la URL de carga obtenida
  
      // Sube el archivo directamente a la URL obtenida desde la memoria
      console.log("Subiendo archivo...");
      await axios.put(uploadURL, req.file.buffer, {
        headers: {
          'Content-Type': req.file.mimetype,
        },
      });
  
      console.log("Archivo subido exitosamente.");
  
      res.status(200).json({ message: 'Archivo subido exitosamente.' });
    } catch (err) {
      console.error("Error en la carga:", err); // Muestra el error completo
      res.status(500).json({ message: err.response ? err.response.data : err.message });
    }
  });
  

// Registro de administradores
router.post("/registro", async (req, res) => {
    const { titulo } = req.body;

    // Inicia validacion para no registrar peliculas con el mismo correo electronico
    const busqueda = await peliculas.findOne({ titulo });

    if (busqueda && busqueda.titulo === titulo) {
        return res.status(401).json({ mensaje: "Pelicula ya registrada" });
    } else {
        const peliculasRegistrar = peliculas(req.body);
        await peliculasRegistrar
            .save()
            .then((data) =>
                res.status(200).json(
                    {
                        mensaje: "Registro exitoso de la pelicula", datos: data
                    }
                ))
            .catch((error) => res.json({ message: error }));
    }
});

// Obtener todos las peliculas
router.get("/listar", async (req, res) => {
    const { tipo } = req.query;
    await peliculas
        .find({ tipo })
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

router.get("/listarUltimosCinco", async (req, res) => {
    const { tipo } = req.query;
    await peliculas
        .find({ tipo })
        .sort({ _id: -1 })
        .limit(5)  // Limitar a los últimos 20 registros
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});


// Obtener todos las series colaboradores
router.get("/listarPeliculasMasVistas", async (req, res) => {
    const { tipo } = req.query;
    await peliculas
        .find({ tipo })
        .sort({ contador: -1 })
        .limit(5)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener todos las series colaboradores
router.get("/listarPeliculasMasVistas", async (req, res) => {
    const { tipo } = req.query;
    await peliculas
        .find({ tipo })
        .sort({ contador: -1 })
        .limit(5)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener todos las series colaboradores
router.get("/listarUltimosCincoEspeciales", async (req, res) => {
    const { tipo } = req.query;
    await peliculas
        .find({ tipo: "especiales" })
        .sort({ createdAt: -1 })
        .limit(5)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener todos las series colaboradores
router.get("/listarUltimo", async (req, res) => {
    const { tipo } = req.query;
    await peliculas
        .find({ tipo })
        .sort({ createdAt: -1 })
        .limit(1)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener las ventas activas con paginacion
router.get("/listarPaginandoActivos", async (req, res) => {
    const { pagina, limite } = req.query;
    //console.log("Pagina ", pagina , " Limite ", limite)

    const skip = (pagina - 1) * limite;

    await peliculas
        .find({ tipo: "interno", estado: "true" })
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limite)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el total de las ventas activas
router.get("/totalPeliculasActivas", async (_req, res) => {
    await peliculas
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

    await peliculas
        .find({ estado: "false" })
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limite)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el total de las ventas canceladas
router.get("/totalPeliculasCancelados", async (_req, res) => {
    await peliculas
        .find({ estado: "false" })
        .count()
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Listar paginando las peliculas
router.get("/listarPaginando", async (req, res) => {
    const { pagina, limite } = req.query;
    //console.log("Pagina ", pagina , " Limite ", limite)

    const skip = (pagina - 1) * limite;

    await peliculas
        .find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limite)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener una pelicula en especifico
router.get("/obtenerPelicula/:id", async (req, res) => {
    const { id } = req.params;
    //console.log("buscando")
    await peliculas
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Borrar una pelicula
router.delete("/eliminar/:id", async (req, res) => {
    const { id } = req.params;
    await peliculas
        .deleteOne({ _id: id })
        .then((data) => res.status(200).json({ mensaje: "Pelicula eliminada" }))
        .catch((error) => res.json({ message: error }));
});

// Cambiar estado la pelicula
router.put("/deshabilitar/:id", async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;
    peliculas
        .updateOne({ _id: id }, { $set: { estado } })
        .then((data) => res.status(200).json({ mensaje: "Estado de la pelicula actualizado" }))
        .catch((error) => res.json({ message: error }));
});

// Actualizar datos de la serie
router.put("/actualizarContador/:id", async (req, res) => {
    const { id } = req.params;
    const { contador } = req.body;

    await peliculas
        .updateOne({ _id: id }, { $set: { contador } })
        .then((data) => res.status(200).json({ mensaje: "Datos de la serie actualizados" }))
        .catch((error) => res.json({ message: error }));
});

// Actualizar datos de la pelicula
router.put("/actualizar/:id", async (req, res) => {
    const { id } = req.params;
    const { titulo, genero, actores, urlVideo, urlPortada, director, tipo, datosTemporada, duracion, sinopsis, calificacion, datos, temporada, año, disponibilidad, patrocinador, patrocinadorPortada, urlPortadaMovil } = req.body;

    await peliculas
        .updateOne({ _id: id }, { $set: { titulo, genero, actores, tipo, urlVideo, urlPortada, datosTemporada, director, duracion, sinopsis, calificacion, datos, temporada, año, disponibilidad, patrocinador, patrocinadorPortada, urlPortadaMovil } })
        .then((data) => res.status(200).json({ mensaje: "Datos de la pelicula actualizados" }))
        .catch((error) => res.json({ message: error }));
});

// Listar solo los productos vendidos en el día solicitado
router.get("/listarDetallesCategoria", async (req, res) => {
    const { tipo } = req.query;
    await peliculas
        .find({ tipo })
        .sort({ _id: -1 })
        .then((data) => {
            let dataTemp = []
            // console.log(data)
            map(data, (datos, indexPrincipal) => {

                map(datos.categorias, (producto, index) => {
                    const { categoria } = producto;
                    dataTemp.push({ id: data[indexPrincipal]._id, titulo: data[indexPrincipal].titulo, categoria: categoria, urlPortada: data[indexPrincipal].urlPortada, urlVideo: data[indexPrincipal].urlVideo, urlPortadaMovil: data[indexPrincipal].urlPortadaMovil })
                })

            })
            res.status(200).json(dataTemp)
        })
        .catch((error) => res.json({ message: error }));
});

const destinationFolder = "/Users/josedavidayalafranco3/Documents/cancun/mi-mexico/src/assets/videos";



router.post('/upload', upload.single('video'), (req, res) => {
    const videoPath = req.file.path;
    res.json({ videoPath });
});

module.exports = router;
