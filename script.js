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
            contenedor.innerHTML = `<p class="nombre2" style="grid-column: 1/-1;">No hay ningún "${query}" en este universo.</p>`;
        }
    } catch (error) {
        console.error("Error buscando datos:", error);
    }
}

// Función para pintar las tarjetas con TU diseño
function renderCards(items, type) {
    contenedor.innerHTML = ""; // <--- ESTO es lo que hace que desaparezcan las fichas viejas

    items.forEach(item => {
        // Imagen por defecto si no es un personaje (Ubicaciones/Episodios)
        const imagenUrl = item.image ? item.image : 'https://via.placeholder.com/210x240?text=No+Image';

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
/* SCRIPT DE LAS OPCIONES DE LAS FICHAS*/
function generarEstado() {
    const estado = document.getElementById("estado");
    const arrayStatus = ["Alive", "unknown", "Dead"];

    let html = '<select name="estado" id="estado">';

    for (let i = 0; i < arrayStatus.length; i++) {
        html += '<option value="' + arrayStatus[i] + '">' + arrayStatus[i] + '</option>';
    }

    html += '</select>';

    estado.innerHTML += html;
}


function generarEspecie() {
    const especie = document.getElementById("especie");
    const arraySpecie = ["Human", "Alien", "Humanoid", "unknown", "Poopybutthole", "Mythological Creature", "Animal", "Robot", "Cronenberg", "Disease"];
    let html = '<select name="especie" id="especie">';

    for (let i = 0; i < arraySpecie.length; i++) {
        html += '<option value="' + arraySpecie[i] + '">' + arraySpecie[i] + '</option>';
    }

    html += '</select>';

    especie.innerHTML += html;
}

function generarTipoC() {
    const tipoC = document.getElementById("tipoC");
    const arrayType = ["None","Genetic experiment", "Superhuman (Ghost trains summoner)", "Parasite", "Human with antennae", "Human with ants in his eyes", "Fish-Person", "Cromulon", "Self-aware arm", "Cat-Person", "Human with baby legs","Bepisian", "Hivemind","Mytholog","Human with giant head","Dog","Bird-Person","Korblock","Boobloosian","Elephant-Person","Superhuman","Gromflomite","Centaur","Organic gun","Microverse inhabitant","Vampire","Light bulb-Alien","Animal","Robot-Crocodile hybrid","Zigerion","Giant","Cone-nippled alien","Demon","Shapeshifter","Game","Amoeba-Person","Cronenberg","Clone","Robot","Interdimensional gaseous being","Flansian","Zombodian","Garblovian","Gazorpian","Eat shiter-Person","Goddess","Gazorpian reproduction robot","Hammerhead-Person","Hole","Tuskfish","Alphabetrian","Cat","Time God","Unknown-nippled alien","Krootabulan","Plutonian","Jellybean","Tentacle alien","Miniverse inhabitant","Cyborg","Larva alien","Snail alien","Tinymouth","Lizard-Person","Alligator-Person","Monster","Conjoined twin","Sentient ant colony","Human Gazorpian","Boobie buyer reptilian","Meeseeks","The Devil","Cat controlled dead lady","Numbericon","Octopus-Person","Hairy alien","Pickle","Bread","Mega Gargantuan","Rat","Gear-Person","Blue ape alien","Ring-nippled alien","Lobster-Alien","Scrotian","Shimshamian","Omniscient being","Slug","Stair goblin","Leprechaun","Morty's toxic side","Rick's toxic side","Traflorkian","Teenyverse inhabitant","Trunk-Person","Tumblorkian","Chair","Drumbloxian","Floop Floopian","Greebybobe", "Corn-person","Phone-Person","Teddy Bear","Little Human","Mexican","Giant Cat Monster","Old Amazons","Mannie","Necrophiliac","Eel","Pizza","Grandma","Phone","Doopidoo","Pripudlian","Nano Alien","Human with a flower in his head","Hologram","Shrimp","Caterpillar","Wasp","Toy","Monogatron","Lizard","Fly","God","Dummy","Human with tusks","Gramuflackian","Dragon","Snake","Human-Snake hybrid","Soulless Puppet","Half Soulless Puppet","Glorzo","Planet","Zeus","Clay-Person","Sexy Aquaman","Narnian","Starfish","Squid","Decoy","Whenwolf","Summon","Morglutzian","Weasel","Super Sperm Monster","CHUD","Giant Incest Baby","CHUD Human Mix","Changeformer","Artificial Intelligence","Guinea Pig for the Polio Vaccine","Turkey","Turkey Human Mix","Anime","Memory","Bird-Person Human Mix","Crow","Cookie","Normal Size Bug","Slartivartian","Ferkusian","Mascot","Scarecrow","Tiger","Crow Horse","Ferret Robot","Passing Butter Robot"];
    let html = '<select name="tipoC" id="tipoC">';

    for (let i = 0; i < arrayType.length; i++) {
        html += '<option value="' + arrayType[i] + '">' + arrayType[i] + '</option>';
    }

    html += '</select>';

    tipoC.innerHTML += html;
}

function generarGenero() {
    const tipo = document.getElementById("genero");
    const arrayGender = ["Male", "Female", "unknown", "Genderless"];
    let html = '<select name="genero" id="genero">';

    for (let i = 0; i < arrayGender.length; i++) {
        html += '<option value="' + arrayGender[i] + '">' + arrayGender[i] + '</option>';
    }

    html += '</select>';

    genero.innerHTML += html;
}

function generarTipoL() {
    const tipoL = document.getElementById("tipoL");
    const arrayType = ["Planet","Cluster","Space station","Microverse","TV","Resort","Fantasy town","Dream","Dimension","unknown","Menagerie","Game","Customs","Daycare","Dwarf planet (Celestial Dwarf)","Miniverse","Teenyverse","Box","Spacecraft","Artificially generated world","Machine","Arcade","Spa","Quadrant","Quasar","Mount","Liquid","Convention","Woods","Diegesis","Non-Diegetic Alternative Reality","Nightmare","Asteroid","Acid Plant","Reality","Death Star","Base","Elemental Rings","Human","Space","Hell","Police Department","Country","Consciousness","Memory"];
    let html = '<select name="tipoL" id="tipoL">';

    for (let i = 0; i < arrayType.length; i++) {
        html += '<option value="' + arrayType[i] + '">' + arrayType[i] + '</option>';
    }

    html += '</select>';

    tipoL.innerHTML += html;
}

function generarDimension() {
    const dimension = document.getElementById("dimension");
    const arrayDimension = [ "Dimension C-137", "unknown", "Post-Apocalyptic Dimension", "Replacement Dimension", "Cronenberg Dimension", "Fantasy Dimension", "Dimension 5-126", "Testicle Monster Dimension", "Cromulon Dimension", "Dimension C-500A","Dimension K-83","Dimension J19ζ7","Eric Stoltz Mask Dimension","Evil Rick's Target Dimension","Giant Telepathic Spiders Dimension","Unknown dimension","Dimension K-22","Dimension D-99","Dimension D716","Dimension D716-B","Dimension D716-C","Dimension J-22","Dimension C-35","Pizza Dimension","Phone Dimension","Chair Dimension","Fascist Dimension","Fascist Shrimp Dimension","Fascist Teddy Bear Dimension","Wasp Dimension","Tusk Dimension","Magic Dimension","Merged Dimension"]
    let html = '<select name="dimension" id="dimension">';

    for (let i = 0; i < arrayDimension.length; i++) {
        html += '<option value="' + arrayDimension[i] + '">' + arrayDimension[i] + '</option>';
    }

    html += '</select>';

    dimension.innerHTML += html;
}

function generarEpisodio() {
    const episodio = document.getElementById("episodio");
    const arrayEpisode = [ "S01E01", "S01E02", "S01E03", "S01E04", "S01E05", "S01E06", "S01E07", "S01E08", "S01E09", "S01E10", "S01E11", "S02E01","S02E02","S02E03","S02E04","S02E05","S02E06","S02E07","S02E08","S02E09","S02E10","S03E01","S03E02","S03E03","S03E04","S03E05","S03E06","S03E07","S03E08","S03E09","S03E10","S04E01","S04E02","S04E03","S04E04","S04E05","S04E06","S04E07","S04E08","S04E09","S04E10","S05E01","S05E02","S05E03","S05E04","S05E05","S05E06","S05E07","S05E08","S05E09","S05E10"]
    let html = '<select name="episodio" id="episodio">';

    for (let i = 0; i < arrayEpisode.length; i++) {
        html += '<option value="' + arrayEpisode[i] + '">' + arrayEpisode[i] + '</option>';
    }

    html += '</select>';

    episodio.innerHTML += html;
}

function mostrarOpciones(){
    const filterType = document.getElementById("filterType");
    const formPersonajes = document.getElementById("formPersonajes");
    const formUbicaciones = document.getElementById("formUbicaciones");
    const formEpisodios = document.getElementById("formEpisodios");

    function mostrarSeleccionables(filtro){
        formPersonajes.style.display = "none";
        formUbicaciones.style.display = "none";
        formEpisodios.style.display = "none";

        if (filtro === "character"){
            formPersonajes.style.display = "block";
        } else if (filtro === "location"){
            formUbicaciones.style.display = "block";
        } else if (filtro === "episode"){
            formEpisodios.style.display = "block";
        }
    }

    filterType.addEventListener("change", function(){
    mostrarSeleccionables(this.value);
    });

    mostrarSeleccionables(filterType.value);
}

/*Activacion y Busqueda*/

document.addEventListener("DOMContentLoaded", function () {
    generarEstado();
    generarEspecie();
    generarTipoC();
    generarGenero();
    generarTipoL();
    generarDimension();
    generarEpisodio();
    
    mostrarOpciones();
    ficha();

    document.getElementById("filterType").addEventListener("change",()=>{
        paginaActual = 1;
        mostrarOpcionesBusqueda();
        ficha();
    });

    document.getElementById("formBusqueda").addEventListener("submit", async(e)=> {
        e.preventDefault();

        const tipo = document.getElementById("filterType").value;
        const texto = document.getElementById("searchInput").value.trim();
 
        let url = "";
 
        if (tipo === "character") {
            const estado = document.getElementById("estadoSelect")?.value || "";
            const especie = document.getElementById("especieSelect")?.value || "";
            const tipoC = document.getElementById("tipoCSelect")?.value || "";
            const genero = document.getElementById("generoSelect")?.value || "";
 
            url = `https://rickandmortyapi.com/api/character/?page=1`;
            if (texto) url += `&name=${encodeURIComponent(texto)}`;
            if (estado) url += `&status=${encodeURIComponent(estado)}`;
            if (especie) url += `&species=${encodeURIComponent(especie)}`;
            if (tipoC) url += `&type=${encodeURIComponent(tipoC)}`;
            if (genero) url += `&gender=${encodeURIComponent(genero)}`;
        }
 
        if (tipo === "location") {
            const tipoL = document.getElementById("tipoLSelect")?.value || "";
            const dimension = document.getElementById("dimensionSelect")?.value || "";
 
            url = `https://rickandmortyapi.com/api/location/?page=1`;
            if (texto) url += `&name=${encodeURIComponent(texto)}`;
            if (tipoL) url += `&type=${encodeURIComponent(tipoL)}`;
            if (dimension && dimension !== "Unknown") {
                url += `&dimension=${encodeURIComponent(dimension)}`;
            }
        }
 
        if (tipo === "episode") {
            const episodio = document.getElementById("episodioSelect")?.value || "";
 
            url = `https://rickandmortyapi.com/api/episode/?page=1`;
            if (texto) url += `&name=${encodeURIComponent(texto)}`;
            if (episodio) url += `&episode=${encodeURIComponent(episodio)}`;
        }
 
        try {
            const respuesta = await fetch(url);
            const datos = await respuesta.json();
 
            if (datos.error) {
                renderFichas([], tipo);
                return;
            }
 
            datosActuales = datos.results || [];
            paginaActual = 1;
            renderFichas(datosActuales, tipo);
        } catch (error) {
            console.error("Error en la búsqueda:", error);
            renderFichas([], tipo);
        }
    })
});

/* FIN SCRIPT DE LAS OPCIONES DE LAS FICHAS*/