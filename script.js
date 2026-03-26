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
        '<div class="imagen">' +
            '<img src="' + char.image + '">' +
        '</div>' +
        '<div class="info_fichas">' +
            '<p>Nombre: ' + char.name + '</p>' +
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
const searchInput = document.getElementById('searchInput');
const filterType = document.getElementById('filterType');
const resultsGrid = document.getElementById('resultsGrid');

// Función principal para obtener datos
async function fetchData() {
    const query = searchInput.value.toLowerCase();
    const type = filterType.value;

    // Construimos la URL con el filtro de nombre (name)
    const url = `https://rickandmortyapi.com/api/${type}/?name=${query}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.results) {
            renderCards(data.results, type);
        } else {
            resultsGrid.innerHTML = '<p>No se encontraron resultados interdimensionales.</p>';
        }
    } catch (error) {
        console.error("Error al obtener datos:", error);
    }
}

// Función para pintar las tarjetas en el HTML
function renderCards(items, type) {
    resultsGrid.innerHTML = ''; // Limpiar resultados anteriores

    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';

        // Estructura condicional: Ubicaciones y Episodios no tienen imagen en la API
        let imageHtml = item.image ? `<img src="${item.image}" alt="${item.name}">` : '';

        let detailsHtml = '';
        if (type === 'character') {
            detailsHtml = `<p>Estado: ${item.status}</p><p>Especie: ${item.species}</p>`;
        } else if (type === 'location') {
            detailsHtml = `<p>Tipo: ${item.type}</p><p>Dimensión: ${item.dimension}</p>`;
        } else if (type === 'episode') {
            detailsHtml = `<p>Fecha: ${item.air_date}</p><p>Código: ${item.episode}</p>`;
        }

        card.innerHTML = `
            ${imageHtml}
            <div class="card-info">
                <h3>${item.name}</h3>
                ${detailsHtml}
            </div>
        `;
        resultsGrid.appendChild(card);
    });
}

// Eventos para actualizar la búsqueda en tiempo real
searchInput.addEventListener('input', fetchData);
filterType.addEventListener('change', fetchData);

// Carga inicial
fetchData();
/*FIN FILTROS*/

