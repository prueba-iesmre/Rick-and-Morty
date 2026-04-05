/* SCRIPT PARA SELECCIONAR TIPO DE BUSQUEDA  */
function cambiarVista() {
    const contenedor = document.getElementById("contenedor");
    contenedor.classList.toggle("contenedorLista");
}
/* FIN SCRIPT PARA SELECCIONAR TIPO DE BUSQUEDA  */

/* SCRIPT PARA CAMBIAR DE PAGINA  */
var numeroPagina = 1;
function paginaSiguiente() {
    numeroPagina ++
    ficha();
    window.scrollTo({
        top: 0,
    });
}

function paginaAnterior(){
    if (numeroPagina > 1) {
        numeroPagina--;
        ficha();
        window.scrollTo({
        top: 0,
    });
    }
}
/* FIN SCRIPT PARA CAMBIAR DE PAGINA  */

/* SCRIPT PARA SELECCIONAR TIPO DE BUSQUEDA  */
function usarAPI() {
    document.getElementById("bienvenida").style.display = "none";
    ficha();
}

function usarBBDD() {
    document.getElementById("bienvenida").style.display = "none";
}
/* FIN SCRIPT PARA SELECCIONAR TIPO DE BUSQUEDA  */

/* SCRIPT PARA HACER FICHAS DINAMICAS CON DATOS DE LA API */
async function ficha() {

const contenedor = document.getElementById("contenedor");
const response = await fetch(`https://rickandmortyapi.com/api/character?page=${numeroPagina}`);
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
            '<p>Ultima ubicacion: ' + char.location.name + '</p>' +
            '<p>Especie: ' + char.species + '</p>' +
            '<p>Estado: ' + char.status + '</p>' +
            '<p>Origen: ' + char.origin.name + '</p>' +
        '</div>' +
    '</div>';
}
}
/* FIN SCRIPT FICHAS DINAMICAS CON DATOS DE LA API */

/*FILTROS*/
const searchInput = document.getElementById('searchInput');
const filterType = document.getElementById('filterType');
const contenedor = document.getElementById('contenedor'); // Usamos tu ID "contenedor"

// Escuchar cada vez que el usuario escribe
searchInput.addEventListener('input', fetchData);
// Escuchar cada vez que cambia el selector (Personajes/Episodios...)
filterType.addEventListener('change', fetchData);

// Función principal para obtener datos
async function fetchData() {
    const query = searchInput.value.toLowerCase().trim();
    const type = filterType.value;

    // Si el buscador está vacío, puedes decidir si mostrar todos o nada.
    // Aquí cargaremos los resultados normales filtrados por nombre.
    const url = `https://rickandmortyapi.com/api/${type}/?name=${query}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.results) {
            // Si hay resultados, mandamos TODO el array a pintar
            renderCards(data.results, type);
        } else {
            // Si escribes algo que no existe, limpiamos la pantalla
            contenedor.innerHTML = `<h2 class="nombre2" style="grid-column: 1/-1;">No hay ningún "${query}" en este universo.</h2>`;
        }
    } catch (error) {
        console.error("Error buscando datos:", error);
    }
}

// Función para pintar las tarjetas con TU diseño
function renderCards(items, type) {
    contenedor.innerHTML = ""; // <--- ESTO es lo que hace que desaparezcan las fichas viejas

    items.forEach(item => {
        // Imagen por defecto de Ubicaciones y Episodios
        const imagenUrl =
        type === 'character' ? item.image :
        type === 'location' ? 'img/ubicacion.jpg' :
        type === 'episode' ? 'img/episodio.jpg':'';

        // Preparamos la info según el tipo
        let infoExtra = "";
        if (type === 'character') {
            infoExtra = `<p>Genero: ${item.gender}</p><p>Especie: ${item.species}</p><p>Estado: ${item.status}</p><p>Origen: ${item.origin.name}</p>`;
        } else if (type === 'location') {
            infoExtra = `<p>Tipo: ${item.type}</p><p>Dimensión: ${item.dimension}</p>`;
        } else {
            infoExtra = `<p>Fecha: ${item.air_date}</p><p>Código: ${item.episode}</p>`;
        }

        // Insertamos la ficha con TU diseño CSS
        contenedor.innerHTML += `
            <div class="fichas">
                <p class="nombre">${item.name}</p>
                <div class="imagen">
                    <img src="${imagenUrl}">
                </div>
                <div class="info_fichas">
                    ${infoExtra}
                </div>
            </div>`;
    });
}
/*FIN FILTROS*/

function abrirNuevaVentana(url) {
    if(url) {
      window.open(url, '_blank'); // abre en nueva pestaña
    }
}