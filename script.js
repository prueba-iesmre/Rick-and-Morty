let numeroPagina = 1;

/* SCRIPT PARA MOSTRAR NUMERO DE PAGINAS  */
function generarNumerosPaginas() {
    const contenedor = document.getElementById("numerosPaginacion");
    contenedor.innerHTML = "";

    let inicio = Math.max(1, numeroPagina - 2);
    let fin = Math.min(totalPaginas, numeroPagina + 2);

    // Primera pagina
    if (inicio > 1) {
        contenedor.innerHTML += `<button class="numeroBtn" onclick="irAPagina(1)">1</button>`;
        if (inicio > 2) {
            contenedor.innerHTML += `<span class="dots">...</span>`;
        }
    }

    // Pagina media
    for (let i = inicio; i <= fin; i++) {
        contenedor.innerHTML += `
            <button class="numeroBtn ${i === numeroPagina ? 'activo' : ''}" onclick="irAPagina(${i})">
                ${i}
            </button>
        `;
    }

    // Ultima pagina
    if (fin < totalPaginas) {
        if (fin < totalPaginas - 1) {
            contenedor.innerHTML += `<span class="dots">...</span>`;
        }
        contenedor.innerHTML += `<button class="numeroBtn" onclick="irAPagina(${totalPaginas})">${totalPaginas}</button>`;
    }
}


function irAPagina(num) {
    numeroPagina = num;
    ficha();
    generarNumerosPaginas();

    window.scrollTo({
        top: 0,
    });
}
/* FIN SCRIPT PARA MOSTRAR NUMERO DE PAGINAS  */


/* SCRIPT PARA SELECCIONAR TIPO DE BUSQUEDA  */
function cambiarVista() {
    const contenedor = document.getElementById("contenedor");
    contenedor.classList.toggle("contenedorLista");

    svgDinamico();
}
/* FIN SCRIPT PARA SELECCIONAR TIPO DE BUSQUEDA  */


/* SCRIPT PARA CAMBIAR SVG DINAMICO  */
function svgDinamico(){
    const grid = document.getElementById("svgGrid");
    const list = document.getElementById("svgList");

    grid.classList.toggle("oculto");
    list.classList.toggle("oculto");
}
/* FIN SCRIPT PARA CAMBIAR SVG DINAMICO  */



/* SCRIPT PARA CAMBIAR DE PAGINA  */

function paginaSiguiente() {
    numeroPagina++;
    ficha();
    generarNumerosPaginas();

    window.scrollTo({
        top: 0,
    });
}

function paginaAnterior(){
    if (numeroPagina > 1) {
        numeroPagina--;
        ficha();
        generarNumerosPaginas();

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
    let url = "";

    if (seccionActual === "character") {
        url = `https://rickandmortyapi.com/api/character?page=${numeroPagina}`;
    } else if (seccionActual === "location") {
        url = `https://rickandmortyapi.com/api/location?page=${numeroPagina}`;
    } else if (seccionActual === "episode") {
        url = `https://rickandmortyapi.com/api/episode?page=${numeroPagina}`;
    }

    const response = await fetch(url);
    const data = await response.json();

    totalPaginas = data.info.pages;

contenedor.innerHTML = "";


for (let i = 0; i < 12; i++) {


const personajes = data.results[i];
contenedor.innerHTML += `
<div class="fichas">
    <div class="header-ficha">
        <div class="contenedor-guardado">
            <button class="btn-guardar" onclick='guardarEnBD(${JSON.stringify(personajes)}, "character")'>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                    <polyline points="17 21 17 13 7 13 7 21"></polyline>
                    <polyline points="7 3 7 8 15 8"></polyline>
                </svg>
            </button>
        </div>
        <p class="nombre">${personajes.name}</p>

        <div class="spacer"></div>
    </div>
    <div class="imagen">
        <img src="${personajes.image}">
    </div>
    <div class="info_fichas">
        <p>Especie: ${personajes.species}</p>
        <p>Estado: ${personajes.status}</p>
        <p>Origen: ${personajes.origin.name}</p>
        <p>Ultima ubicación: ${personajes.location.name}</p>
    </div>
</div>`;
}

    generarNumerosPaginas();
}

/*Cambiar seccion */

let seccionActual = "character";

function cambiarSeccion(nuevaSeccion) {
    seccionActual = nuevaSeccion;
    numeroPagina = 1;
    ficha();

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

// Función para pintar las tarjetas en el buscador usando el diseño que tienen las fichas y para el modo lista


function renderCards(items, type) {
    contenedor.innerHTML = "";

    items.forEach(item => {

        // Imagen según tipo
        const imagenUrl =
            type === 'character' ? item.image :
            type === 'location' ? 'img/ubicacion.jpg' :
            type === 'episode' ? 'img/episodio.jpg' : '';

        let infoExtra = "";


        //Seccion personajes
        if (type === 'character') {
            infoExtra = `
                <p>Especie: ${item.species}</p>
                <p>Estado: ${item.status}</p>
                <p>Origen: ${item.origin.name}</p>
                <p>Ultima ubicacion: ${item.location.name}</p>

            `;
        } else if (type === 'location') {
            infoExtra = `
                <p>Tipo: ${item.type}</p>
                <p>Dimensión: ${item.dimension}</p>
            `;
        } else {
            infoExtra = `
                <p>Fecha: ${item.air_date}</p>
                <p>Código: ${item.episode}</p>
            `;
        }

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
            </div>`;
    });
}

// FIN Buscador y modo lista estilo

function abrirNuevaVentana(url) {
    if(url) {
      window.open(url, '_blank'); // abre en nueva pestaña
    }
}

function btnvolver(){
    window.history.back();
}


/*SCRIPT PARA GUARDAR INFO EN BBDD*/
function guardarEnBD(item, type) {
    // CREAMOS ARCHIVO JSON
    let datos = {
        tipo_dato: type,
        nombre: item.name,
        // TERNARIO PARA COMPROBAR QUE QUEREMOS GUARDAR
        imagen: type === 'character' ? item.image : (type === 'location' ? 'img/ubicacion.jpg' : 'img/episodio.jpg')
    };

    // AÑADIMOS DATOS SEGÚN EL TIPO
    if (type === 'character') {
        datos.especie = item.species;
        datos.estado = item.status;
        datos.origen = item.origin.name;
        datos.genero = item.location.name; // Usamos esto para la "ultima_ubicacion" en Java
    } else if (type === 'location') {
        datos.tipo = item.type;
        datos.dimension = item.dimension;
    } else if (type === 'episode') {
        datos.air_date = item.air_date;
        datos.episode = item.episode;
    }

    // 3. ENVIAMOS LOS DATOS AL SERVIDOR (FETCH)
    fetch('http://localhost:8080/guardar', {
        method: 'POST', // Usamos post para enviar informacion al servidor
        headers: { 'Content-Type': 'application/json' }, // Decimos que enviamos un JSON
        body: JSON.stringify(datos) // Convertimos el objeto JS a texto plano
    })
    .then(async respuesta => {
        // Leemos el texto que nos devuelve Java
        const mensaje = await respuesta.text();

        if (respuesta.ok) {
            alert("✅ " + mensaje); // "Personaje guardado!"
        } else if (respuesta.status === 409) {
            alert("❌" + mensaje); // "Ya estaba guardado anteriormente"
        } else {
            alert("❌ Error: " + mensaje);
        }
    })
    .catch(error => {
        // Si el servidor Java está apagado, entrará aquí
        alert("🔌 No se pudo conectar con el servidor Java. ¿Está encendido?");
    });
}
/* FIN SCRIPT PARA GUARDAR INFO EN BBDD*/