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

    if (hayBusquedaActiva()) return;

    let inicio = Math.max(1, numeroPagina - 2);
    let fin = Math.min(totalPaginas, numeroPagina + 2);

    if (inicio > 1) {
        contenedor.innerHTML += `<button class="numeroBtn" onclick="irAPagina(1)">1</button>`;
        if (inicio > 2) contenedor.innerHTML += `<span class="dots">...</span>`;
    }

    for (let i = inicio; i <= fin; i++) {
        contenedor.innerHTML += `
            <button class="numeroBtn ${i === numeroPagina ? "activo" : ""}" onclick="irAPagina(${i})">
                ${i}
            </button>
        `;
    }

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
    if (hayBusquedaActiva()) return;
    if (numeroPagina < totalPaginas) {
        numeroPagina++;
        cargarDatos();
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
}

function paginaAnterior() {
    if (hayBusquedaActiva()) return;
    if (numeroPagina > 1) {
        numeroPagina--;
        cargarDatos();
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
}

function actualizarVisibilidadPaginacion() {
    const botonesPag = document.querySelector(".botonesPaginacion");
    const numerosPag = document.getElementById("numerosPaginacion");
    const mostrar = !hayBusquedaActiva() && modoFuente === "API";

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
    const bloqueCharacter = document.getElementById("opciones-character");
    const bloqueLocation = document.getElementById("opciones-location");
    const bloqueEpisode = document.getElementById("opciones-episode");

    if (bloqueCharacter) bloqueCharacter.classList.add("oculto");
    if (bloqueLocation) bloqueLocation.classList.add("oculto");
    if (bloqueEpisode) bloqueEpisode.classList.add("oculto");

    if (seccionActual === "character" && bloqueCharacter) bloqueCharacter.classList.remove("oculto");
    if (seccionActual === "location" && bloqueLocation) bloqueLocation.classList.remove("oculto");
    if (seccionActual === "episode" && bloqueEpisode) bloqueEpisode.classList.remove("oculto");
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
    const ids = [
        "estadoSelect",
        "especieSelect",
        "tipoCSelect",
        "generoSelect",
        "tipoLSelect",
        "dimensionSelect",
        "episodioSelect"
    ];

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

    let url = `https://rickandmortyapi.com/api/${seccionActual}/?page=1`;

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
    if (!contenedor) return;
    contenedor.innerHTML = "";
    contenedor.appendChild(crearSelect("estadoSelect", ["alive", "dead", "unknown"], "Todos"));
}

function generarEspecie() {
    const contenedor = document.getElementById("especie");
    if (!contenedor) return;
    contenedor.innerHTML = "";
    contenedor.appendChild(
        crearSelect(
            "especieSelect",
            ["Human", "Alien", "Humanoid", "Robot", "Animal", "Mythological Creature", "Cronenberg"],
            "Todas"
        )
    );
}

function generarTipoC() {
    const contenedor = document.getElementById("tipoC");
    if (!contenedor) return;
    contenedor.innerHTML = "";
    contenedor.appendChild(crearSelect("tipoCSelect", ["Genetic experiment", "Parasite", "Superhuman", "Clone"], "Todos"));
}

function generarGenero() {
    const contenedor = document.getElementById("genero");
    if (!contenedor) return;
    contenedor.innerHTML = "";
    contenedor.appendChild(crearSelect("generoSelect", ["Female", "Male", "Genderless", "unknown"], "Todos"));
}

function generarTipoL() {
    const contenedor = document.getElementById("tipoL");
    if (!contenedor) return;
    contenedor.innerHTML = "";
    contenedor.appendChild(
        crearSelect(
            "tipoLSelect",
            ["Planet", "Cluster", "Microverse", "TV", "Resort", "Fantasy town", "Dream"],
            "Todos"
        )
    );
}

function generarDimension() {
    const contenedor = document.getElementById("dimension");
    if (!contenedor) return;
    contenedor.innerHTML = "";
    contenedor.appendChild(
        crearSelect(
            "dimensionSelect",
            ["Dimension C-137", "Replacement Dimension", "Cronenberg Dimension", "Fantasy Dimension", "Unknown"],
            "Todas"
        )
    );
}

function generarEpisodio() {
    const contenedor = document.getElementById("episodio");
    if (!contenedor) return;
    contenedor.innerHTML = "";
    contenedor.appendChild(
        crearSelect(
            "episodioSelect",
            ["S01E01", "S01E02", "S01E03", "S02E01", "S03E01", "S04E01", "S05E01"],
            "Todos"
        )
    );
}

/* -------------------- CARGA CENTRAL -------------------- */
function cargarDatos() {
    actualizarVisibilidadPaginacion();

    if (hayBusquedaActiva()) {
        fetchData();
    } else {
        if (modoFuente === "BBDD") {
            cargarDesdeBBDD();
        } else {
            ficha();
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
        alert("🔌 No se pudo conectar con el servidor Java. ¿Está encendido?");
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

            if (seccionActual === "location") {
                if (filtros.type) coincideFiltros = coincideFiltros && (item.type === filtros.type || item.tipo === filtros.type);
                if (filtros.dimension) coincideFiltros = coincideFiltros && item.dimension === filtros.dimension;
            }

            if (seccionActual === "episode") {
                if (filtros.episode) coincideFiltros = coincideFiltros && item.episode === filtros.episode;
            }

            return coincideTexto && coincideFiltros;
        });

        if (resultadosFiltrados.length === 0) {
            contenedor.innerHTML = `<h2 class="nombre2" style="grid-column: 1/-1;">No hay resultados en tu base de datos.</h2>`;
        } else {
            renderCards(resultadosFiltrados, seccionActual);
        }
    } catch (error) {
        console.error("Error buscando en BBDD:", error);
        contenedor.innerHTML = `<h2 class="nombre2" style="grid-column: 1/-1;">Error buscando en la base de datos.</h2>`;
    }
}

/* -------------------- API -------------------- */
async function ficha() {
    const contenedor = document.getElementById("contenedor");
    if (!contenedor) return;

    try {
        const claveCache = `${seccionActual}-${numeroPagina}`;

        if (!cache[claveCache]) {
            const url = `https://rickandmortyapi.com/api/${seccionActual}?page=${numeroPagina}`;
            const response = await fetch(url);
            const data = await response.json();

            if (!data.results) {
                contenedor.innerHTML = `<h2 class="nombre2" style="grid-column: 1/-1;">No hay resultados</h2>`;
                return;
            }

            totalPaginas = data.info.pages;
            cache[claveCache] = data.results;
        }

        const datos = cache[claveCache];
        const mostrar = datos.slice(0, 12);

        renderCards(mostrar, seccionActual);
        generarNumerosPaginas();
    } catch (error) {
        console.error("Error cargando fichas:", error);
        contenedor.innerHTML = `<h2 class="nombre2" style="grid-column: 1/-1;">Error cargando datos</h2>`;
    }
}

async function fetchData() {
    const contenedor = document.getElementById("contenedor");
    if (!contenedor) return;

    actualizarVisibilidadPaginacion();

    if (modoFuente === "BBDD") {
        buscarEnBBDDLocal();
        return;
    }

    const url = construirUrlBusquedaAPI();

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.results && data.results.length > 0) {
            renderCards(data.results.slice(0, 12), seccionActual);
        } else {
            contenedor.innerHTML = `<h2 class="nombre2" style="grid-column: 1/-1;">No hay resultados</h2>`;
        }
    } catch (error) {
        console.error("Error buscando datos en API:", error);
        contenedor.innerHTML = `<h2 class="nombre2" style="grid-column: 1/-1;">No hay resultados</h2>`;
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
            type === "location" ? "img/ubicacion.jpg" :
            type === "episode" ? "img/episodio.jpg" : "";

        let infoExtra = "";

        if (type === "character") {
            infoExtra = `
                <p>Especie: ${item.species ?? item.especie ?? "Desconocida"}</p>
                <p>Estado: ${item.status ?? item.estado ?? "Desconocido"}</p>
                <p>Origen: ${item.origin?.name ?? item.origen ?? "Desconocido"}</p>
                <p>Última ubicación: ${item.location?.name ?? item.genero ?? item.location ?? "Desconocida"}</p>
            `;
        } else if (type === "location") {
            infoExtra = `
                <p>Tipo: ${item.type ?? item.tipo ?? "Desconocido"}</p>
                <p>Dimensión: ${item.dimension ?? "Desconocida"}</p>
            `;
        } else if (type === "episode") {
            infoExtra = `
                <p>Fecha: ${item.air_date ?? "Desconocida"}</p>
                <p>Código: ${item.episode ?? "Desconocido"}</p>
            `;
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
        if (respuesta.ok) {
            alert("💾 " + mensaje);
        } else if (respuesta.status === 409) {
            alert("❌ " + mensaje);
        } else {
            alert("❌ Error: " + mensaje);
        }
    })
    .catch(() => {
        alert("🔌 No se pudo conectar con el servidor Java. ¿Está encendido?");
    });
}

/* -------------------- UTILIDADES -------------------- */
function abrirNuevaVentana(url) {
    if (url) window.open(url, "_blank");
}

function btnvolver() {
    window.history.back();
}

/* -------------------- EVENT LISTENERS -------------------- */
window.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.getElementById("contenedor");
    if (!contenedor) return;

    const urlParams = new URLSearchParams(window.location.search);
    const fuente = urlParams.get("fuente");
    modoFuente = fuente === "BBDD" ? "BBDD" : "API";

    searchInput = document.getElementById("searchInput");
    filterType = document.getElementById("filterType");
    formBusqueda = document.getElementById("formBusqueda");

    generarEstado();
    generarEspecie();
    generarTipoC();
    generarGenero();
    generarTipoL();
    generarDimension();
    generarEpisodio();

    if (filterType) {
        filterType.value = seccionActual;
        filterType.addEventListener("change", (e) => {
            seccionActual = e.target.value;
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

    const idsFiltros = [
        "estadoSelect",
        "especieSelect",
        "tipoCSelect",
        "generoSelect",
        "tipoLSelect",
        "dimensionSelect",
        "episodioSelect"
    ];

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
    actualizarVisibilidadPaginacion();
    cargarDatos();
});