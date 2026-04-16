let numeroPagina = 1;
let totalPaginas = 0;
let seccionActual = "character";
let modoFuente = "API";
let cache = {};

let searchInput = null;
let filterType = null;
let formBusqueda = null;

/* -------------------- PAGINACIÓN -------------------- */
function generarNumerosPaginas() {
    const contenedor = document.getElementById("numerosPaginacion");
    if (!contenedor) return;

    contenedor.innerHTML = "";

    // Si no hay páginas (0 resultados), no mostramos nada
    if (totalPaginas < 1) return;

    // Calculamos el rango de páginas a mostrar (vecinas a la actual)
    let inicio = Math.max(1, numeroPagina - 2);
    let fin = Math.min(totalPaginas, numeroPagina + 2);

    // Botón de la primera página y puntos suspensivos si estamos lejos del inicio
    if (inicio > 1) {
        contenedor.innerHTML += `<button class="numeroBtn" onclick="irAPagina(1)">1</button>`;
        if (inicio > 2) contenedor.innerHTML += `<span class="dots">...</span>`;
    }

    // Dibujar el rango de páginas calculado
    for (let i = inicio; i <= fin; i++) {
        contenedor.innerHTML += `
            <button class="numeroBtn ${i === numeroPagina ? "activo" : ""}" onclick="irAPagina(${i})">
                ${i}
            </button>
        `;
    }

    // Botón de la última página y puntos suspensivos si estamos lejos del final
    if (fin < totalPaginas) {
        if (fin < totalPaginas - 1) contenedor.innerHTML += `<span class="dots">...</span>`;
        contenedor.innerHTML += `<button class="numeroBtn" onclick="irAPagina(${totalPaginas})">${totalPaginas}</button>`;
    }
}

function irAPagina(num) {
    numeroPagina = num;
    cargarDatos();
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function paginaSiguiente() {
    // Solo avanza si la página actual es menor al total
    if (numeroPagina < totalPaginas) {
        numeroPagina++;
        cargarDatos();
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
}

function paginaAnterior() {
    // Solo retrocede si no estamos en la primera
    if (numeroPagina > 1) {
        numeroPagina--;
        cargarDatos();
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
}

function actualizarVisibilidadPaginacion() {
    const botonesPag = document.querySelector(".botonesPaginacion");
    const numerosPag = document.getElementById("numerosPaginacion");

    // Ahora solo depende de si estamos en modo API, no de si hay búsqueda
    const mostrar = modoFuente === "API";

    if (botonesPag) botonesPag.style.display = mostrar ? "flex" : "none";
    if (numerosPag) numerosPag.style.display = mostrar ? "flex" : "none";
}

/* -------------------- VISTAS Y UI -------------------- */
function cambiarVista() {
    const contenedor = document.getElementById("contenedor");
    if (!contenedor) return;
    contenedor.classList.toggle("contenedorLista");
    svgDinamico();
}

function svgDinamico() {
    const grid = document.getElementById("svgGrid");
    const list = document.getElementById("svgList");
    if (grid) grid.classList.toggle("oculto");
    if (list) list.classList.toggle("oculto");
}

function mostrarOpcionesBusqueda() {
    const bloques = ["opciones-character", "opciones-location", "opciones-episode"];
    bloques.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add("oculto");
    });

    const actual = document.getElementById(`opciones-${seccionActual}`);
    if (actual) actual.classList.remove("oculto");
}

/* -------------------- SELECCIÓN DE FUENTE -------------------- */
function usarAPI() {
    window.location.href = "app.html?fuente=API";
}

async function usarBBDD() {
    try {
        const res = await fetch(`http://localhost:8080/obtener?tipo=character`);
        if (res.ok) {
            window.location.href = "app.html?fuente=BBDD";
            return;
        }
        alert("⚠️ Error en el servidor");
    } catch (e) {
        alert("🔌 Servidor apagado. ¿Está encendido?");
    }
}

/* -------------------- CAMBIO DE SECCIÓN -------------------- */
function cambiarSeccion(nuevaSeccion) {
    seccionActual = nuevaSeccion;
    numeroPagina = 1;
    cache = {};

    if (searchInput) searchInput.value = "";
    if (filterType) filterType.value = nuevaSeccion;

    limpiarFiltros();
    mostrarOpcionesBusqueda();
    cargarDatos();
}

function limpiarFiltros() {
    const ids = ["estadoSelect", "especieSelect", "tipoCSelect", "generoSelect", "tipoLSelect", "dimensionSelect", "episodioSelect"];
    ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = "";
    });
}

/* -------------------- FILTROS -------------------- */
function obtenerFiltrosActuales() {
    if (seccionActual === "character") {
        return {
            status: document.getElementById("estadoSelect")?.value || "",
            species: document.getElementById("especieSelect")?.value || "",
            type: document.getElementById("tipoCSelect")?.value || "",
            gender: document.getElementById("generoSelect")?.value || ""
        };
    }
    if (seccionActual === "location") {
        return {
            type: document.getElementById("tipoLSelect")?.value || "",
            dimension: document.getElementById("dimensionSelect")?.value || ""
        };
    }
    if (seccionActual === "episode") {
        return {
            episode: document.getElementById("episodioSelect")?.value || ""
        };
    }
    return {};
}

function hayBusquedaActiva() {
    const texto = searchInput?.value.trim() || "";
    const filtros = obtenerFiltrosActuales();
    return texto !== "" || Object.values(filtros).some(valor => valor !== "");
}

function construirUrlBusquedaAPI() {
    const texto = searchInput?.value.trim() || "";
    const filtros = obtenerFiltrosActuales();

    // IMPORTANTE: Se usa numeroPagina para que la paginación funcione en la búsqueda
    let url = `https://rickandmortyapi.com/api/${seccionActual}/?page=${numeroPagina}`;

    if (texto !== "") url += `&name=${encodeURIComponent(texto)}`;

    for (const [clave, valor] of Object.entries(filtros)) {
        if (valor !== "") url += `&${clave}=${encodeURIComponent(valor)}`;
    }

    return url;
}

/* -------------------- GENERAR SELECTORES -------------------- */
function crearSelect(idSelect, opciones, textoInicial = "Todos") {
    const select = document.createElement("select");
    select.id = idSelect;
    const opcionInicial = document.createElement("option");
    opcionInicial.value = "";
    opcionInicial.textContent = textoInicial;
    select.appendChild(opcionInicial);

    opciones.forEach(opcion => {
        const option = document.createElement("option");
        option.value = opcion;
        option.textContent = opcion;
        select.appendChild(option);
    });
    return select;
}

function generarEstado() {
    const contenedor = document.getElementById("estado");
    if (contenedor) {
        contenedor.innerHTML = "";
        contenedor.appendChild(crearSelect("estadoSelect", ["alive", "dead", "unknown"], "Todos"));
    }
}

function generarEspecie() {
    const contenedor = document.getElementById("especie");
    if (contenedor) {
        contenedor.innerHTML = "";
        contenedor.appendChild(crearSelect("especieSelect", ["Human", "Alien", "Humanoid", "Robot", "Animal", "Mythological Creature", "Cronenberg"], "Todas"));
    }
}

function generarTipoC() {
    const contenedor = document.getElementById("tipoC");
    if (contenedor) {
        contenedor.innerHTML = "";
        contenedor.appendChild(crearSelect("tipoCSelect", ["Genetic experiment", "Parasite", "Superhuman", "Clone"], "Todos"));
    }
}

function generarGenero() {
    const contenedor = document.getElementById("genero");
    if (contenedor) {
        contenedor.innerHTML = "";
        contenedor.appendChild(crearSelect("generoSelect", ["Female", "Male", "Genderless", "unknown"], "Todos"));
    }
}

function generarTipoL() {
    const contenedor = document.getElementById("tipoL");
    if (contenedor) {
        contenedor.innerHTML = "";
        contenedor.appendChild(crearSelect("tipoLSelect", ["Planet", "Cluster", "Microverse", "TV", "Resort", "Fantasy town", "Dream"], "Todos"));
    }
}

function generarDimension() {
    const contenedor = document.getElementById("dimension");
    if (contenedor) {
        contenedor.innerHTML = "";
        contenedor.appendChild(crearSelect("dimensionSelect", ["Dimension C-137", "Replacement Dimension", "Cronenberg Dimension", "Fantasy Dimension", "Unknown"], "Todas"));
    }
}

function generarEpisodio() {
    const contenedor = document.getElementById("episodio");
    if (contenedor) {
        contenedor.innerHTML = "";
        contenedor.appendChild(crearSelect("episodioSelect", ["S01E01", "S01E02", "S01E03", "S02E01", "S03E01", "S04E01", "S05E01"], "Todos"));
    }
}

/* -------------------- CARGA CENTRAL -------------------- */
function cargarDatos() {
    actualizarVisibilidadPaginacion();

    if (hayBusquedaActiva()) {
        fetchData(); // Búsqueda con filtros
    } else {
        if (modoFuente === "BBDD") {
            cargarDesdeBBDD();
        } else {
            ficha(); // Carga normal de la API
        }
    }
}

/* -------------------- BBDD -------------------- */
async function cargarDesdeBBDD() {
    const contenedor = document.getElementById("contenedor");
    if (!contenedor) return;

    try {
        const response = await fetch(`http://localhost:8080/obtener?tipo=${seccionActual}`);
        const data = await response.json();

        if (!Array.isArray(data) || data.length === 0) {
            contenedor.innerHTML = `<h2 class="nombre2" style="grid-column: 1/-1;">No hay datos guardados en este universo.</h2>`;
        } else {
            renderCards(data, seccionActual);
        }
    } catch (error) {
        console.error("Error cargando desde BBDD:", error);
        alert("🔌 No se pudo conectar con el servidor Java.");
        window.location.replace("index.html");
    }
}

async function buscarEnBBDDLocal() {
    const contenedor = document.getElementById("contenedor");
    if (!contenedor) return;

    const texto = searchInput?.value.toLowerCase().trim() || "";
    const filtros = obtenerFiltrosActuales();

    try {
        const response = await fetch(`http://localhost:8080/obtener?tipo=${seccionActual}`);
        const data = await response.json();

        const resultadosFiltrados = data.filter(item => {
            const nombre = item.name?.toLowerCase() || item.nombre?.toLowerCase() || "";
            const coincideTexto = nombre.includes(texto);
            let coincideFiltros = true;

            if (seccionActual === "character") {
                if (filtros.status) coincideFiltros = coincideFiltros && (item.status === filtros.status || item.estado === filtros.status);
                if (filtros.species) coincideFiltros = coincideFiltros && (item.species === filtros.species || item.especie === filtros.species);
                if (filtros.type) coincideFiltros = coincideFiltros && (item.type === filtros.type);
                if (filtros.gender) coincideFiltros = coincideFiltros && (item.gender === filtros.gender || item.genero === filtros.gender);
            }
            // ... (resto de filtros de location/episode iguales)
            return coincideTexto && coincideFiltros;
        });

        if (resultadosFiltrados.length === 0) {
            contenedor.innerHTML = `<h2 class="nombre2" style="grid-column: 1/-1;">No hay resultados en tu base de datos.</h2>`;
        } else {
            renderCards(resultadosFiltrados, seccionActual);
        }
    } catch (error) {
        contenedor.innerHTML = `<h2 class="nombre2" style="grid-column: 1/-1;">Error buscando en la base de datos.</h2>`;
    }
}

/* -------------------- API -------------------- */
async function ficha() {
    const contenedor = document.getElementById("contenedor");
    if (!contenedor) return;

    try {
        const claveCache = `${seccionActual}-${numeroPagina}`;

        // 1. Si NO está en caché, pedimos los datos
        if (!cache[claveCache]) {
            const url = `https://rickandmortyapi.com/api/${seccionActual}?page=${numeroPagina}`;
            const response = await fetch(url);
            const data = await response.json();

            if (!data.results) {
                contenedor.innerHTML = `<h2 class="nombre2" style="grid-column: 1/-1;">No hay resultados</h2>`;
                totalPaginas = 0;
                generarNumerosPaginas();
                return;
            }

            // GUARDAMOS AMBAS COSAS EN LA CACHÉ
            cache[claveCache] = {
                personajes: data.results,
                total: data.info.pages
            };
        }

        // 2. RECUPERAMOS de la caché (sea nueva o antigua)
        const datosEnCache = cache[claveCache];

        // ACTUALIZAMOS SIEMPRE LA VARIABLE GLOBAL
        totalPaginas = datosEnCache.total;

        // 3. RENDERIZAMOS
        // Nota: Si quieres ver los 42, recuerda que la API trae 20 por página.
        // Con .slice(0, 12) solo muestras 12 de esos 20.
        renderCards(datosEnCache.personajes.slice(0, 12), seccionActual);

        // 4. REGENERAMOS PAGINACIÓN (Ahora sí sabrá que totalPaginas es 3)
        generarNumerosPaginas();

    } catch (error) {
        console.error("Error en ficha:", error);
        contenedor.innerHTML = `<h2 class="nombre2" style="grid-column: 1/-1;">Error cargando datos</h2>`;
    }
}

async function fetchData() {
    const contenedor = document.getElementById("contenedor");
    if (!contenedor) return;

    if (modoFuente === "BBDD") {
        buscarEnBBDDLocal();
        return;
    }

    const url = construirUrlBusquedaAPI();

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.results && data.results.length > 0) {
            // ACTUALIZAMOS TOTAL DE PÁGINAS PARA LA BÚSQUEDA
            totalPaginas = data.info.pages;
            renderCards(data.results.slice(0, 12), seccionActual);
            generarNumerosPaginas(); // VOLVEMOS A DIBUJAR LA PAGINACIÓN
        } else {
            totalPaginas = 0;
            contenedor.innerHTML = `<h2 class="nombre2" style="grid-column: 1/-1;">No hay resultados</h2>`;
            generarNumerosPaginas();
        }
    } catch (error) {
        totalPaginas = 0;
        contenedor.innerHTML = `<h2 class="nombre2" style="grid-column: 1/-1;">No hay resultados</h2>`;
        generarNumerosPaginas();
    }
}

/* -------------------- RENDER -------------------- */
function renderCards(items, type) {
    const contenedor = document.getElementById("contenedor");
    if (!contenedor) return;

    contenedor.innerHTML = "";

    items.forEach(item => {
        const imagenUrl =
            type === "character" ? item.image :
            type === "location" ? "../img/ubicacion.jpg" :
            type === "episode" ? "../img/episodio.jpg" : "";

        let infoExtra = "";
        if (type === "character") {
            infoExtra = `
                <p>Especie: ${item.species ?? item.especie ?? "Desconocida"}</p>
                <p>Estado: ${item.status ?? item.estado ?? "Desconocido"}</p>
                <p>Origen: ${item.origin?.name ?? item.origen ?? "Desconocido"}</p>
                <p>Última ubicación: ${item.location?.name ?? item.genero ?? item.location ?? "Desconocida"}</p>
            `;
        } else if (type === "location") {
            infoExtra = `<p>Tipo: ${item.type ?? item.tipo ?? "Desconocido"}</p><p>Dimensión: ${item.dimension ?? "Desconocida"}</p>`;
        } else if (type === "episode") {
            infoExtra = `<p>Fecha: ${item.air_date ?? "Desconocida"}</p><p>Código: ${item.episode ?? "Desconocido"}</p>`;
        }

        const itemString = JSON.stringify(item).replace(/'/g, "&#39;");

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
                    <p class="nombre">${item.name ?? item.nombre ?? "Sin nombre"}</p>
                    <div class="spacer"></div>
                </div>
                <div class="imagen">
                    <img src="${imagenUrl}" alt="${item.name ?? item.nombre ?? "Imagen"}">
                </div>
                <div class="info_fichas">
                    ${infoExtra}
                </div>
            </div>
        `;
    });
}

/* -------------------- GUARDAR EN BBDD -------------------- */
function guardarEnBD(item, type) {
    let datos = {
        tipo_dato: type,
        nombre: item.name,
        imagen: type === "character" ? item.image : (type === "location" ? "img/ubicacion.jpg" : "img/episodio.jpg")
    };

    if (type === "character") {
        datos.especie = item.species;
        datos.estado = item.status;
        datos.origen = item.origin.name;
        datos.genero = item.location.name;
    } else if (type === "location") {
        datos.tipo = item.type;
        datos.dimension = item.dimension;
    } else if (type === "episode") {
        datos.air_date = item.air_date;
        datos.episode = item.episode;
    }

    fetch("http://localhost:8080/guardar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos)
    })
    .then(async respuesta => {
        const mensaje = await respuesta.text();
        alert(respuesta.ok ? "💾 " + mensaje : "❌ " + mensaje);
    })
    .catch(() => alert("🔌 No se pudo conectar con el servidor Java."));
}

/* -------------------- UTILIDADES -------------------- */
function abrirNuevaVentana(url) { if (url) window.open(url, "_blank"); }
function btnvolver() { window.history.back(); }

/* -------------------- EVENT LISTENERS -------------------- */
window.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.getElementById("contenedor");
    if (!contenedor) return;

    const urlParams = new URLSearchParams(window.location.search);
    modoFuente = urlParams.get("fuente") === "BBDD" ? "BBDD" : "API";

    searchInput = document.getElementById("searchInput");
    filterType = document.getElementById("filterType");
    formBusqueda = document.getElementById("formBusqueda");

    generarEstado(); generarEspecie(); generarTipoC(); generarGenero(); generarTipoL(); generarDimension(); generarEpisodio();

    if (filterType) {
        filterType.value = seccionActual;
        filterType.addEventListener("change", (e) => {
            seccionActual = e.target.value;

            if (searchInput) searchInput.value = "";
            limpiarFiltros();

            numeroPagina = 1;
            cache = {};
            mostrarOpcionesBusqueda();
            cargarDatos();
        });
    }

    if (searchInput) {
        searchInput.addEventListener("input", () => {
            numeroPagina = 1;
            cargarDatos();
        });
    }

    const idsFiltros = ["estadoSelect", "especieSelect", "tipoCSelect", "generoSelect", "tipoLSelect", "dimensionSelect", "episodioSelect"];
    idsFiltros.forEach(id => {
        const elemento = document.getElementById(id);
        if (elemento) {
            elemento.addEventListener("change", () => {
                numeroPagina = 1;
                cargarDatos();
            });
        }
    });

    if (formBusqueda) {
        formBusqueda.addEventListener("submit", (e) => {
            e.preventDefault();
            numeroPagina = 1;
            cargarDatos();
        });
    }

    mostrarOpcionesBusqueda();
    cargarDatos();
});
