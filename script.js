let numeroPagina = 1;
let totalPaginas = 0;
let seccionActual = "character";
let modoFuente = "API";

/* SCRIPT PARA MOSTRAR NUMERO DE PAGINAS */
function generarNumerosPaginas() {
    const contenedor = document.getElementById("numerosPaginacion");
    if (!contenedor) return;
    contenedor.innerHTML = "";

    let inicio = Math.max(1, numeroPagina - 2);
    let fin = Math.min(totalPaginas, numeroPagina + 2);

    if (inicio > 1) {
        contenedor.innerHTML += `<button class="numeroBtn" onclick="irAPagina(1)">1</button>`;
        if (inicio > 2) contenedor.innerHTML += `<span class="dots">...</span>`;
    }

    for (let i = inicio; i <= fin; i++) {
        contenedor.innerHTML += `
            <button class="numeroBtn ${i === numeroPagina ? 'activo' : ''}" onclick="irAPagina(${i})">
                ${i}
            </button>`;
    }

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

function cargarDatos(){
    if (modoFuente === "BBDD") {
        cargarDesdeBBDD();
    }else{
        ficha();
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
    modoFuente = "API"
    document.getElementById("bienvenida").style.display = "none";
    ficha();
}

function usarBBDD() {
    modoFuente= "BBDD"
    document.getElementById("bienvenida").style.display = "none";
}

function cambiarSeccion(nuevaSeccion) {
    seccionActual = nuevaSeccion;
    numeroPagina = 1;
    //BORRA EL INPUT AL CAMBIAR EL SEARCH
    if (searchInput) searchInput.value = "";
    if (modoFuente === "BBDD") {
        cargarDesdeBBDD();
    } else {
        ficha();
    }
}


/* LOGICA PARA FETCH DESDE BBDD */

async function usarBBDD() {
    modoFuente = "BBDD";
    document.getElementById("bienvenida").style.display = "none";
    document.getElementById("numerosPaginacion").style.display = "none";
    cargarDesdeBBDD();
}

async function cargarDesdeBBDD() {
    const contenedor = document.getElementById("contenedor");

    try {
        const response = await fetch(`http://localhost:8080/obtener?tipo=${seccionActual}`);
        const data = await response.json();

        if (data.length === 0) {
            contenedor.innerHTML = `<h2 class="nombre2" style="grid-column: 1/-1;">No hay datos guardados en este universo.</h2>`;
        } else {
            renderCards(data, seccionActual);
        }
    } catch (error) {
        console.error("Error cargando desde BBDD:", error);
        alert("🔌 Error al conectar con la base de datos.");
    }
}

/* LOGICA PARA FETCH DESDE BBDD */

/* LÓGICA DE CARGA DE DATOS (FICHAS) */
async function ficha() {
    const contenedor = document.getElementById("contenedor");
    let url = `https://rickandmortyapi.com/api/${seccionActual}?page=${numeroPagina}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        totalPaginas = data.info.pages;

        renderCards(data.results, seccionActual);
        generarNumerosPaginas();
    } catch (error) {
        console.error("Error cargando fichas:", error);
    }
}

/* RENDERIZADO UNIFICADO (Usa tu diseño de botón + lógica de datos de tu compañero) */
function renderCards(items, type) {
    const contenedor = document.getElementById("contenedor");
    contenedor.innerHTML = "";

    items.forEach(item => {
        // Lógica de imágenes de tu compañero
        const imagenUrl =
            type === 'character' ? item.image :
            type === 'location' ? 'img/ubicacion.jpg' :
            type === 'episode' ? 'img/episodio.jpg' : '';

        // Lógica de info extra de tu compañero
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

        // Estructura final con TU botón de guardar
        contenedor.innerHTML += `
            <div class="fichas">
                <div class="header-ficha">
                    <div class="contenedor-guardado">
                        <button class="btn-guardar" onclick='guardarEnBD(${JSON.stringify(item)}, "${type}")'>
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
const searchInput = document.getElementById('searchInput');
const filterType = document.getElementById('filterType');

if (searchInput) searchInput.addEventListener('input', fetchData);
if (filterType) filterType.addEventListener('change', fetchData);

async function fetchData() {
    const query = searchInput.value.toLowerCase().trim();
    const type = filterType.value;

    if (modoFuente === "BBDD") {
        buscarEnBBDDLocal(query, type);
        return;
    }

    const url = `https://rickandmortyapi.com/api/${type}/?name=${query}`;
    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.results) {
            renderCards(data.results, type);
        } else {
            document.getElementById('contenedor').innerHTML = `<h2 class="nombre2" style="grid-column: 1/-1;">No hay ningún "${query}" en este universo.</h2>`;
        }
    } catch (error) {
        console.error("Error buscando datos en API:", error);
    }
}

//FUNCION PARA BUSCAR SOLO EN BBDD
async function buscarEnBBDDLocal(query, type) {
    const contenedor = document.getElementById("contenedor");
    try {

        const response = await fetch(`http://localhost:8080/obtener?tipo=${type}`);
        const data = await response.json();


        const resultadosFiltrados = data.filter(item =>
            item.name.toLowerCase().includes(query)
        );

        if (resultadosFiltrados.length === 0) {
            contenedor.innerHTML = `<h2 class="nombre2" style="grid-column: 1/-1;">"${query}" no está en tu base de datos.</h2>`;
        } else {
            renderCards(resultadosFiltrados, type);
        }
    } catch (error) {
        console.error("Error buscando en BBDD:", error);
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