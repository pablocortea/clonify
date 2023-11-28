// APP.JS - Archivo principal del servidor Express

// Librerías requeridas
const express = require("express");
const path = require("path");
const fs = require("fs");
const mediaserver = require("mediaserver");
const multer = require("multer");

// Renombro la variable con todas las funcionalidades de express
const app = express();

// Ruta para servir archivos estáticos (CSS, imágenes, javascript, etc.)
app.use(express.static(path.join(__dirname, "public")));


/* --- RUTA HOME ----------------------------------- */

// Cuando el usuario ejecute la url, se realizará una petición GET y el servidor devolverá el index
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "index.html"));
});

/* --- RUTA DE LAS CANCIONES ----------------------- */

// Ruta para obtener la lista de canciones
app.get('/songs', function (req, res) {
    // Lee el archivo que contiene la lista de canciones
    fs.readFile(path.join(__dirname, 'songlist.json'), 'utf-8', function (err, data) {
        if (err) {
            console.error('Error al leer el archivo de canciones:', err);
            res.status(500).send('Error al obtener la lista de canciones');
            return;
        }
        res.json(JSON.parse(data));
    });
});


/* --- RUTA DE STREAMING  -------------------------- */
app.get("/songs/:name", function(req, res) { // Maneja las solicitudes de reproducción de canciones
    const songName = req.params.name;
    const songPath = path.join(__dirname, "songs", songName);
    res.sendFile(songPath); // Envia el archivo de la canción al cliente
});


/* --- SUBIR CANCIONES A CLONIFY ------------------- */

// Gestión de subida y almacenamiento de archivos con "multer"
const storage = multer.diskStorage({
    // Ubicación del archivo
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "songs"));
    },

    // Nombre del archivo (independientemente de lo que se suba, lo bajo a minúsculas)
    filename: function (req, file, cb) {
        const extension = path.extname(file.originalname); // .mp3
        const withoutExtension = path.basename(file.originalname, extension); // Quito .mp3 al nombre
        const lowerCase = withoutExtension.toLowerCase(); // Convierto el nombre a minúsculas
        const finalName = lowerCase + extension; // Le vuelvo a añadir .mp3

        cb(null, finalName);
    },
});

const upload = multer({ storage: storage });

// Subida de canciones (POST)
app.post("/songs", upload.single("song"), function (req, res) {
    const jsonRoot = path.join(__dirname, "songlist.json");
    const name = req.file.originalname.toLowerCase(); // Lo convierte a minúsculas

    fs.readFile(jsonRoot, "utf-8", function (err, file) {
        if (err) {
            res.status(500).send("Error al leer el archivo de canciones.");
            return;
        }

        try {
            const songs = JSON.parse(file); // Convierte el archivo a un objeto javascript para manipularlo
            songs.push({ name: name }); // Le añade al final la última canción

            fs.writeFile(jsonRoot, JSON.stringify(songs), function (err) { // Lo vuelve a convertir a texto
                if (err) {
                    res.status(500).send("Error al guardar las canciones actualizadas.");
                    return;
                }

                res.status(200).send(
                    `La canción ${name} ha sido agregada exitosamente.`
                );
            });
        } catch (error) {
            res.status(500).send("Error al procesar la solicitud.");
        }
    });
});

// Borrado de canciones (DELETE)
app.delete("/songs/:name", function (req, res) {
    const songName = req.params.name;
    const songsFile = path.join(__dirname, "songlist.json");

    // Lee el archivo de canciones
    fs.readFile(songsFile, "utf-8", function (err, data) {
        if (err) {
            res.status(500).send("Error interno del servidor.");
            return;
        }

        let songs = JSON.parse(data); // Lo convierte a objeto javascript

        songs = songs.filter((song) => song.name !== songName); // Filtra las canciones para mantener todas excepto la que se quiere eliminar


        // Guarda la lista actualizada de canciones
        fs.writeFile(songsFile, JSON.stringify(songs), function (err) {
            if (err) {
                res.status(500).send("Error interno del servidor.");
                return;
            }

            res.status(200).send(`La canción ${songName} ha sido eliminada.`);
        });
    });
});

// Similar al EventListener de node, pero en express
app.listen(8800, function () { // Escuchando en el puerto 8800...
    console.log("Aplicación corriendo...");
});