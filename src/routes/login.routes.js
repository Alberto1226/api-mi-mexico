const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const usuariosModelo = require("../models/usuarios");

// Para validar los datos del inicio de sesion
router.post('/login', async (req, res) => {
    const { email, contraseña } = req.body;

    console.log(email, contraseña)

    const usuarios = await usuariosModelo.findOne({ email });

    if (!usuarios) return res.status(401).json({ mensaje: "Usuario no registrado" });
    if (usuarios.estado === "true") {
        if (usuarios.email !== email) return res.status(401).json({ mensaje: "Usuario Incorrecto" });
        if (usuarios.contraseña !== contraseña) return res.status(401).json({ mensaje: "Contraseña Incorrecta" });

        const token = await jwt.sign({ _: usuarios._id }, 'secretkey', {
            expiresIn: 86400
        });

        res.status(200).json({ token });
    } else {
        return res.status(401).json({ mensaje: "Inicio de sesion no autorizado" })
    }

});

module.exports = router;
