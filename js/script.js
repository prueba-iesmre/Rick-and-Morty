let numeroPagina = 1;
let totalPaginas = 0;
let seccionActual = "character";
let modoFuente = "API";

/* SCRIPT PARA MOSTRAR NUMERO DE PAGINAS */
function generarNumerosPaginas() {
    const contenedor = document.getElementById("numerosPaginacion");
    if (!contenedor) return;

    contenedor.innerHTML = "";

    // 🧠 si estamos en búsqueda, no mostramos paginación

    let inicio = Math.max(1, numeroPagina - 2);
    let fin = Math.min(totalPaginas, numeroPagina + 2);

    // ⬅️ botón primera página
    if (inicio > 1) {
        contenedor.innerHTML += `<button class="numeroBtn" onclick="irAPagina(1)">1</button>`;
        if (inicio > 2) contenedor.innerHTML += `<span class="dots">...</span>`;
    }

    // 🔢 páginas centrales
    for (let i = inicio; i <= fin; i++) {
        contenedor.innerHTML += `
            <button class="numeroBtn ${i === numeroPagina ? 'activo' : ''}"
            onclick="irAPagina(${i})">
                ${i}
            </button>`;
    }

    // ➡️ última página
    if (fin < totalPaginas) {
        if (fin < totalPaginas - 1) contenedor.innerHTML += `<span class="dots">...</span>`;
        contenedor.innerHTML += `<button class="numeroBtn" onclick="irAPagina(${totalPaginas})">${totalPaginas}</button>`;
    }
}

function irAPagina(num) {
    numeroPagina = num;
    cargarDatos();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* VISTAS Y UI */
function cambiarVista() {
    const contenedor = document.getElementById("contenedor");
    contenedor.classList.toggle("contenedorLista");
    svgDinamico();
}

function svgDinamico() {
    const grid = document.getElementById("svgGrid");
    const list = document.getElementById("svgList");
    grid.classList.toggle("oculto");
    list.classList.toggle("oculto");
}

function cargarDatos() {
    if (modoFuente === "BBDD") {
        gestionarBBDD();
    } else {
        const query = searchInput ? searchInput.value.trim() : "";
        if (query !== "") {
            fetchData();
        } else {
            ficha();
        }
    }
}


function paginaSiguiente() {
    numeroPagina++;
    cargarDatos();
    window.scrollTo({ top: 0 });
}

function paginaAnterior() {
    if (numeroPagina > 1) {
        numeroPagina--;
        cargarDatos();
        window.scrollTo({ top: 0 });
    }
}

function usarAPI() {
    window.location.href = "app.html?fuente=API";
}


function cambiarSeccion(nuevaSeccion) {
    seccionActual = nuevaSeccion;
    numeroPagina = 1;
    //BORRA EL INPUT AL CAMBIAR EL SEARCH
    if (searchInput) searchInput.value = "";
    cache = {};
    if (modoFuente === "BBDD") {
        gestionarBBDD();
    } else {
        ficha();
    }
}


/* LOGICA PARA FETCH DESDE BBDD */

async function usarBBDD() {
    try {
        const res = await fetch(`http://localhost:8080/obtener?tipo=character`);
        if (res.ok) return window.location.href = "app.html?fuente=BBDD";

        alert("⚠️ Error en el servidor");
    } catch (e) {
        alert("🔌 Servidor apagado. ¿Está encendido?");
    }
}

/* LOGICA PARA FETCH DESDE BBDD */
/* LÓGICA DE CARGA DE DATOS (FICHAS) */
let cache = {};

async function ficha() {
    const contenedor = document.getElementById("contenedor");

    try {

        // 1. Si no tengo la página, la pido a la API
        if (!cache[numeroPagina]) {
            let url = `https://rickandmortyapi.com/api/${seccionActual}?page=${numeroPagina}`;
            const response = await fetch(url);
            const data = await response.json();

            totalPaginas = data.info.pages;

            cache[numeroPagina] = data.results;
        }

        // 2. Cojo los datos de esa página
        let datos = cache[numeroPagina];

        // 3. Muestro solo 12
        let mostrar = datos.slice(0, 12);

        // 4. Pinto en pantalla
        renderCards(mostrar, seccionActual);
        generarNumerosPaginas();

    } catch (error) {
        console.error("Error cargando fichas:", error);
    }
}

/* RENDERIZADO UNIFICADO (Usa tu diseño de botón + lógica de datos de tu compañero) */
function renderCards(items, type) {
    const contenedor = document.getElementById("contenedor");
    contenedor.innerHTML = "";

    //Maximo 12 items
    const itemsLimitados = items.slice(0, 12);

    itemsLimitados.forEach(item => {
        // Imagenes para cada seccion
        const imagenUrl =
            type === 'character' ? item.image :
            type === 'location' ? '../img/ubicacion.jpg' :
            type === 'episode' ? '../img/episodio.jpg' : '';

        // Informacion extra
        let infoExtra = "";
        if (type === 'character') {
            infoExtra = `
                <p>Especie: ${item.species}</p>
                <p>Estado: ${item.status}</p>
                <p>Origen: ${item.origin.name}</p>
                <p>Última ubicación: ${item.location.name}</p>`;
        } else if (type === 'location') {
            infoExtra = `
                <p>Tipo: ${item.type}</p>
                <p>Dimensión: ${item.dimension}</p>`;
        } else if (type === 'episode') {
            infoExtra = `
                <p>Fecha: ${item.air_date}</p>
                <p>Código: ${item.episode}</p>`;
        }

        //Convertimos el objeto a texto y reemplazamos la comilla con codigo html para no romper la query
        const itemString = JSON.stringify(item).replace(/'/g, "&#39;");

        // Estructura final con el botón de guardar
        contenedor.innerHTML += `
            <div class="fichas">
                <div class="header-ficha">
                    <div class="contenedor-guardado">
                        <button class="btn-guardar" onclick='guardarEnBD(${itemString}, "${type}")'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                                <polyline points="7 3 7 8 15 8"></polyline>
                            </svg>
                        </button>
                    </div>
                    <p class="nombre">${item.name}</p>
                    <div class="spacer"></div>
                </div>
                <div class="imagen">
                    <img src="${imagenUrl}">
                </div>
                <div class="info_fichas">
                    ${infoExtra}
                </div>
            </div>`;
    });
}

/* FILTROS Y BUSCADOR */
const searchInput = document.getElementById('searchInput'); // input de búsqueda
const filterType = document.getElementById('filterType');   // tipo (personaje, etc.)

// ejecuta búsqueda al escribir o cambiar tipo
if (searchInput) {
    searchInput.addEventListener('input', () => {
        numeroPagina = 1;
        fetchData();
    });
}

if (filterType) {
    filterType.addEventListener('change', () => {
        numeroPagina = 1; // También reseteamos si cambiamos de Personaje a Episodio
        fetchData();
    });
}


//  BUSCADOR PRINCIPAL
async function fetchData() {
    const query = searchInput.value.toLowerCase().trim();
    const type = filterType.value;

    if (modoFuente === "BBDD") {
        gestionarBBDD();
        return;
    }

    // Si el buscador está vacío, volvemos a la carga normal (página 1)
    if (query === "") {
        numeroPagina = 1;
        ficha();
        return;
    }

    // URL con filtro y pagina actual
    const url = `https://rickandmortyapi.com/api/${type}/?name=${query}&page=${numeroPagina}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.results) {
            // Actualiza paginas totales
            totalPaginas = data.info.pages;

            renderCards(data.results.slice(0, 12), type);

            // Genera pagiacion
            generarNumerosPaginas();
        } else {
            totalPaginas = 0;
            document.getElementById('contenedor').innerHTML =
                `<h2 class="nombre2" style="grid-column: 1/-1;">No hay ningún "${query}" en este universo.</h2>`;
            generarNumerosPaginas();
        }
    } catch (error) {
        console.error("Error buscando datos en API:", error);
    }
}

async function gestionarBBDD() {
    const contenedor = document.getElementById("contenedor");
    const query = searchInput?.value.toLowerCase().trim() || ""; // Captura el buscador

    try {
        const response = await fetch(`http://localhost:8080/obtener?tipo=${seccionActual}`);
        let data = await response.json();

        // 1. Si hay algo escrito, filtramos. Si no, usamos 'data' tal cual.
        if (query) {
            data = data.filter(item => item.name.toLowerCase().includes(query));
        }


        totalPaginas = Math.ceil(data.length / 12);

        if (data.length === 0) {
        let mensaje;

        if (query) {
        // Mensaje cuando el usuario busca algo y no aparece
        mensaje = `No hay ningún "${query}" en tu base de datos.`;
        }  else {
        // Traductor de secciones para el mensaje
        const nombresSecciones = {
            'character': 'personajes',
            'location': 'ubicaciones',
            'episode': 'episodios'
        };

        const seccionNombre = nombresSecciones[seccionActual];
        mensaje = `No hay ${seccionNombre} guardados tu base de datos.`;
    }

    contenedor.innerHTML = `<h2 class="nombre2" style="grid-column: 1/-1;">${mensaje}</h2>`;
} else {
    const inicio = (numeroPagina - 1) * 12;
    renderCards(data.slice(inicio, inicio + 12), seccionActual);
}

        generarNumerosPaginas();

    } catch (error) {
        console.error("Error:", error);
        alert("🔌 No se pudo conectar con el servidor Java. ¿Está encendido?");
    }
}


/* SCRIPT PARA GUARDAR INFO EN BBDD (Tu funcionalidad intacta) */
function guardarEnBD(item, type) {
    let datos = {
        tipo_dato: type,
        nombre: item.name,
        imagen: type === 'character' ? item.image : (type === 'location' ? 'img/ubicacion.jpg' : 'img/episodio.jpg')
    };

    if (type === 'character') {
        datos.especie = item.species;
        datos.estado = item.status;
        datos.origen = item.origin.name;
        datos.genero = item.location.name;
    } else if (type === 'location') {
        datos.tipo = item.type;
        datos.dimension = item.dimension;
    } else if (type === 'episode') {
        datos.air_date = item.air_date;
        datos.episode = item.episode;
    }

    fetch('http://localhost:8080/guardar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
    })
    .then(async respuesta => {
        const mensaje = await respuesta.text();
        if (respuesta.ok) {
            alert("💾 " + mensaje);
        } else if (respuesta.status === 409) {
            alert("❌ " + mensaje);
        } else {
            alert("❌ Error: " + mensaje);
        }
    })
    .catch(error => {
        alert("🔌 No se pudo conectar con el servidor Java. ¿Está encendido?");
    });
}

function abrirNuevaVentana(url) {
    if(url) window.open(url, '_blank');
}

function btnvolver(){
    window.history.back();
}


//Funcion para cargar paginas al cambiar de index a app.html
window.addEventListener('DOMContentLoaded', () => {
    const contenedor = document.getElementById("contenedor");

    if (contenedor) {
        const urlParams = new URLSearchParams(window.location.search);
        const fuente = urlParams.get('fuente');

        if (fuente === "BBDD") {
            modoFuente = "BBDD";
            gestionarBBDD();
        } else {
            modoFuente = "API";
            ficha();
        }
    }
});