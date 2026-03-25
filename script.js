/* SCRIPT PARA CAMBIAR VISTA DE FICHAS  */
function cambiarVista() {
    const contenedor = document.getElementById("contenedor");
    contenedor.classList.toggle("contenedorLista");
}
/* FIN SCRIPT PARA SELECCIONAR TIPO DE BUSQUEDA  */

/* SCRIPT PARA SELECCIONAR TIPO DE BUSQUEDA  */
function usarAPI() {
    document.getElementById("bienvenida").style.display = "none";
}

function usarBBDD() {
    document.getElementById("bienvenida").style.display = "none";
}
/* FIN SCRIPT PARA SELECCIONAR TIPO DE BUSQUEDA  */

/* SCRIPT PARA HACER FICHAS DINAMICAS CON DATOS DE LA API */
async function ficha() {

const contenedor = document.getElementById("contenedor");

const response = await fetch("https://rickandmortyapi.com/api/character");
const data = await response.json();

contenedor.innerHTML = "";

for (let i = 0; i < 12; i++) {

    const char = data.results[i];

    contenedor.innerHTML +=
    '<div class="fichas">' +
        '<p class="nombre">' + char.name + '</p>' +
        '<div class="imagen">' +
            '<img src="' + char.image + '">' +
        '</div>' +
        '<div class="info_fichas">' +
            '<p>Genero: ' + char.gender + '</p>' +
            '<p>Especie: ' + char.species + '</p>' +
            '<p>Estado: ' + char.status + '</p>' +
            '<p>Origen: ' + char.origin.name + '</p>' +
        '</div>' +
    '</div>';
}
}
/* FIN SCRIPT FICHAS DINAMICAS CON DATOS DE LA API */



