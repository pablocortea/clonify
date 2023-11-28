# Clonify - Tu reproductor de música

Clonify es una aplicación de reproductor de música simple que te permite cargar, reproducir y eliminar canciones. Este repositorio contiene el código fuente de la aplicación.

## Funcionalidades

- **Carga de canciones:** Permite subir archivos MP3 para agregar nuevas canciones a la lista de reproducción.
- **Reproducción de canciones:** Reproduce las canciones disponibles en la lista.
- **Eliminación de canciones:** Elimina canciones de la lista de reproducción.
- **Interfaz amigable:** Facilidad de uso en un entorno intuitivo.

## Tecnologías utilizadas

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express.js
- **Librerías:** Multer (para la gestión de archivos), Mediaserver (streaming de archivos de audio)

## Instrucciones de uso

1. **Clonar el repositorio:** `git clone https://github.com/pablocortea/clonify.git`
2. **Instalar dependencias:** `npm install`
3. **Iniciar la aplicación:** `npm start`
4. **Acceder a tu localhost:** Teclea la dirección `http://localhost:8800` en tu navegador.
5. **Añadir canciones:** Puedes subir cualquier archivo con extensión *.mp3. Procura que el nombre de tu archivo esté nombrado "Nombre-del-artista_Titulo-Canción.mp3", para que el nombre se visualice correctamente en la aplicación.
6. **Añadir foto del album/single:** Si quieres que en tus reproducciones aparezca la imagen del album o single mientras suena la canción, puedes subir una imagen a escala 1:1 (por ejemplo, 800x800 píxeles), con el mismo nombre del archivo *.mp3. **Importante:** el nombre debe ser igual, pero tiene que ir en minúsculas.

## Estructura del proyecto

- `app.js`: Archivo principal del servidor Express.
- `main.js`: Archivo que gestiona la lógica del reproductor de música en el lado del cliente.
- `songlist.json`: Archivo JSON que contiene la lista de canciones.
- `index.html`: Página principal del reproductor de música.
- `styles.css`: Archivo de hoja de estilos para el diseño de la interfaz.
- `/public`: Carpeta que contiene archivos estáticos como CSS, imágenes y JavaScript del frontend.
- `/songs`: Directorio donde se almacenan las canciones subidas por los usuarios.

## Contribuciones y Pull Requests

¡Gracias por considerar contribuir a este proyecto! Si deseas hacer mejoras o cambios:

1. Haz un fork del repositorio.
2. Realiza tus cambios.
3. Envía un Pull Request desde tu rama hacia la rama principal del proyecto.

## Licencia

Este proyecto está bajo la [Licencia MIT](LICENSE).
