// MAIN.JS - Archivo que gestiona la lógica del reproductor de música en el lado del cliente

let currentSongIndex = 0; // Se inicia en la primera canción
let songs = [];

// CARGA DE LA LISTA DE CANCIONES
function loadSongs() {
    fetch("/songs")
        .then((response) => response.json())
        .then((fetchedSongs) => {
            songs = fetchedSongs;
            fetchedSongs.forEach((song) => {
                addSongToList(song);
            });
        })
        .catch((error) => {
            console.error("Error al cargar la lista de canciones:", error);
        });
};

// AGREGAR ELEMENTOS A LA LISTA DE REPRODUCCIÓN
function addSongToList(song) {
    const songList = document.querySelector(".list"); // Muestra la lista <ul class="list"></ul>
    const listItem = document.createElement("li");

    // Nombre modificado para que se muestre como quiero
    const modifiedSongName = song.name
        .split("-")
        .join(" ")
        .split("_")
        .join(" - ")
        .replace(".mp3", "")
        .replace(/\b\w/g, (char) => char.toUpperCase());
    listItem.textContent = modifiedSongName;

    const deleteButton = document.createElement("button"); // Botón de eliminar canción
    deleteButton.textContent = "X"; // Contenido del botón
    deleteButton.addEventListener("click", (event) => {
        event.stopPropagation(); // Evita que se dispare el evento "play" al hacer clic en la fila de la canción
        deleteSong(song.name);
    });

    listItem.appendChild(deleteButton); // Añade el botón de borrado al elemento (canción)
    songList.appendChild(listItem); // Añade el elemento a la lista

    // Agregar un atributo personalizado con el nombre de la canción
    listItem.setAttribute("data-song", `/songs/${encodeURIComponent(song.name)}`);

    // Al hacer clic en la canción, la reproduce
    listItem.addEventListener("click", () =>
        playSong(`/songs/${encodeURIComponent(song.name)}`)
    );
};

// MODO DE REPRODUCCIÓN SECUENCIAL
function playSequentially() {
    if (currentSongIndex < songs.length) { // Si no es la última canción...
        playSong(`/songs/${encodeURIComponent(songs[currentSongIndex].name)}`);
        currentSongIndex++; // le añade 1 (reproduce la siguiente)
    } else {
        console.log("Se han reproducido todas las canciones.");
    };
};

// REPRODUCCIÓN DE CANCIONES
function playSong(songPath) {
    const audioPlayer = document.getElementById("audioPlayer");
    const currentSongTitle = document.getElementById("currentSongTitle"); // Elemento para mostrar el título de la canción

    if (!audioPlayer.paused) {
        audioPlayer.pause();
    }

    audioPlayer.src = songPath;
    audioPlayer.play();

    // Obtiene el nombre de la canción actual
    const currentSongName = decodeURIComponent(
        songPath.split("/").pop().replace(".mp3", "")
    );
    const modifiedSongName = currentSongName
        .split("-")
        .join(" ")
        .split("_")
        .join(" - ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
    currentSongTitle.textContent = modifiedSongName; // Actualiza el título de la canción actual con el nombre como quiero

    const albumImage = document.getElementById("albumImage");
    albumImage.src = `/images/${currentSongName}.jpg`; // Intenta cargar la imagen con el mismo nombre

    albumImage.onerror = function () {
        albumImage.src = "/images/default.jpg"; // Carga la imagen por defecto si no se encuentra la del álbum
    };

    // Estilos para destacar la canción actual en el listado
    const songElements = document.querySelectorAll(".list li"); // Obtiene la lista de elementos <li> que contienen las canciones
    songElements.forEach((element) => {
        element.classList.remove("current-song"); // Itera sobre cada canción y elimina la clase 'current-song' si está presente
    });

    const currentSongElement = document.querySelector(`.list li[data-song="${songPath}"]`);
    if (currentSongElement) {
        currentSongElement.classList.add("current-song"); // Encuentra la canción actual y agregar la clase 'current-song'
    }

    // Espera 3 segundos a que suene la siguiente canción
    audioPlayer.onended = () => setTimeout(playSequentially, 3000);
}

// ELIMINACIÓN DE ELEMENTOS
function deleteSong(songNameToDelete) {
    const indexToDelete = songs.findIndex(
        (song) => song.name === songNameToDelete
    );
    if (indexToDelete !== -1) {
        songs.splice(indexToDelete, 1);
        console.log(`La canción ${songNameToDelete} ha sido eliminada.`);
        loadSongs(); // Recarga la lista de canciones después de eliminar una canción
    } else {
        console.log(`La canción ${songNameToDelete} no existe en la lista.`);
    }
}

// Inicia el listado de canciones al cargar la página
document.addEventListener("DOMContentLoaded", loadSongs);
