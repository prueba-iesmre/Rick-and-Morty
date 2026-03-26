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
const response = await fetch("https://rickandmortyapi.com/api/character?page={0}");
const data = await response.json();
console.log(data);

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

/*FILTROS*/
/* ============================= */
/* BUSCADOR (FILTRO POR NOMBRE) */
/* ============================= */
function activarBuscador() {
    const searchInput = document.getElementById("searchInput");

    searchInput.addEventListener("input", function () {
        const texto = searchInput.value.toLowerCase();
        const fichas = document.querySelectorAll(".fichas");

        fichas.forEach(ficha => {
            const nombre = ficha.querySelector(".nombre").textContent.toLowerCase();

            if (nombre.includes(texto)) {
                ficha.style.display = "";
            } else {
                ficha.style.display = "none";
            }
        });
    });
}


/* ============================= */
/* INICIO DE LA WEB */
/* ============================= */
window.onload = async function () {
    await ficha();       // primero carga personajes
    activarBuscador();   // luego activa el buscador
};
/*FIN FILTROS*/

