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

/* SCRIPT DE LAS OPCIONES DE LAS FICHAS*/
function generarEstado() {
    const estado = document.getElementById("estado");
    const arrayStatus = ["Alive", "unknown", "Dead"];
    
    let html = '<select name="estado" id="estado">';

    for (let i = 0; i < arrayStatus.length; i++) {
        html += '<option value="' + i+1 + '">' + arrayStatus[i] + '</option>';
    }

    html += '</select>';
    
    estado.innerHTML += html;
}


function generarEspecie() {
    const especie = document.getElementById("especie"); 
    const arraySpecie = ["Human", "Alien", "Humanoid", "unknown", "Poopybutthole", "Mythological Creature", "Animal", "Robot", "Cronenberg", "Disease"];
    let html = '<select name="especie" id="especie">';

    for (let i = 0; i < arraySpecie.length; i++) {
        html += '<option value="' + i+1 + '">' + arraySpecie[i] + '</option>';
    }

    html += '</select>';

    especie.innerHTML += html;
}

function generarTipoC() {
    const tipoC = document.getElementById("tipoC"); 
    const arrayType = ["Genetic experiment", "Superhuman (Ghost trains summoner)", "Parasite", "Human with antennae", "Human with ants in his eyes", "Fish-Person", "Cromulon", "Self-aware arm", "Cat-Person", "Human with baby legs","Bepisian", "Hivemind","Mytholog","Human with giant head","Dog","Bird-Person","Korblock","Boobloosian","Elephant-Person","Superhuman","Gromflomite","Centaur","Organic gun","Microverse inhabitant","Vampire","Light bulb-Alien","Animal","Robot-Crocodile hybrid","Zigerion","Giant","Cone-nippled alien","Demon","Shapeshifter","Game","Amoeba-Person","Cronenberg","Clone","Robot","Interdimensional gaseous being","Flansian","Zombodian","Garblovian","Gazorpian","Eat shiter-Person","Goddess","Gazorpian reproduction robot","Hammerhead-Person","Hole","Tuskfish","Alphabetrian","Cat","Time God","Unknown-nippled alien","Krootabulan","Plutonian","Jellybean","Tentacle alien","Miniverse inhabitant","Cyborg","Larva alien","Snail alien","Tinymouth","Lizard-Person","Alligator-Person","Monster","Conjoined twin","Sentient ant colony","Human Gazorpian","Boobie buyer reptilian","Meeseeks","The Devil","Cat controlled dead lady","Numbericon","Octopus-Person","Hairy alien","Pickle","Bread","Mega Gargantuan","Rat","Gear-Person","Blue ape alien","Ring-nippled alien","Lobster-Alien","Scrotian","Shimshamian","Omniscient being","Slug","Stair goblin","Leprechaun","Morty's toxic side","Rick's toxic side","Traflorkian","Teenyverse inhabitant","Trunk-Person","Tumblorkian","Chair","Drumbloxian","Floop Floopian","Greebybobe", "Corn-person","Phone-Person","Teddy Bear","Little Human","Mexican","Giant Cat Monster","Old Amazons","Mannie","Necrophiliac","Eel","Pizza","Grandma","Phone","Doopidoo","Pripudlian","Nano Alien","Human with a flower in his head","Hologram","Shrimp","Caterpillar","Wasp","Toy","Monogatron","Lizard","Fly","God","Dummy","Human with tusks","Gramuflackian","Dragon","Snake","Human-Snake hybrid","Soulless Puppet","Half Soulless Puppet","Glorzo","Planet","Zeus","Clay-Person","Sexy Aquaman","Narnian","Starfish","Squid","Decoy","Whenwolf","Summon","Morglutzian","Weasel","Super Sperm Monster","CHUD","Giant Incest Baby","CHUD Human Mix","Changeformer","Artificial Intelligence","Guinea Pig for the Polio Vaccine","Turkey","Turkey Human Mix","Anime","Memory","Bird-Person Human Mix","Crow","Cookie","Normal Size Bug","Slartivartian","Ferkusian","Mascot","Scarecrow","Tiger","Crow Horse","Ferret Robot","Passing Butter Robot"];
    let html = '<select name="tipoC" id="tipoC">';

    for (let i = 0; i < arrayType.length; i++) {
        html += '<option value="' + i+1 + '">' + arrayType[i] + '</option>';
    }

    html += '</select>';

    tipoC.innerHTML += html;
}

function generarGenero() {
    const tipo = document.getElementById("genero"); 
    const arrayGender = ["Male", "Female", "unknown", "Genderless"];
    let html = '<select name="genero" id="genero">';

    for (let i = 0; i < arrayGender.length; i++) {
        html += '<option value="' + i+1 + '">' + arrayGender[i] + '</option>';
    }

    html += '</select>';

    genero.innerHTML += html;
}

function generarTipoL() {
    const tipoL = document.getElementById("tipoL");
    const arrayType = ["Planet","Cluster","Space station","Microverse","TV","Resort","Fantasy town","Dream","Dimension","unknown","Menagerie","Game","Customs","Daycare","Dwarf planet (Celestial Dwarf)","Miniverse","Teenyverse","Box","Spacecraft","Artificially generated world","Machine","Arcade","Spa","Quadrant","Quasar","Mount","Liquid","Convention","Woods","Diegesis","Non-Diegetic Alternative Reality","Nightmare","Asteroid","Acid Plant","Reality","Death Star","Base","Elemental Rings","Human","Space","Hell","Police Department","Country","Consciousness","Memory"];
    let html = '<select name="tipoL" id="tipoL">';

    for (let i = 0; i < arrayType.length; i++) {
        html += '<option value="' + i+1 + '">' + arrayType[i] + '</option>';
    }

    html += '</select>';
    
    tipoL.innerHTML += html;
}

function generarDimension() {
    const dimension = document.getElementById("dimension");
    const arrayDimension = [ "Dimension C-137", "unknown", "Post-Apocalyptic Dimension", "Replacement Dimension", "Cronenberg Dimension", "Fantasy Dimension", "Dimension 5-126", "Testicle Monster Dimension", "Cromulon Dimension", "Dimension C-500A","Dimension K-83","Dimension J19ζ7","Eric Stoltz Mask Dimension","Evil Rick's Target Dimension","Giant Telepathic Spiders Dimension","Unknown dimension","Dimension K-22","Dimension D-99","Dimension D716","Dimension D716-B","Dimension D716-C","Dimension J-22","Dimension C-35","Pizza Dimension","Phone Dimension","Chair Dimension","Fascist Dimension","Fascist Shrimp Dimension","Fascist Teddy Bear Dimension","Wasp Dimension","Tusk Dimension","Magic Dimension","Merged Dimension"]
    let html = '<select name="dimension" id="dimension">';

    for (let i = 0; i < arrayDimension.length; i++) {
        html += '<option value="' + i+1 + '">' + arrayDimension[i] + '</option>';
    }

    html += '</select>';
    
    dimension.innerHTML += html;
}

function generarEpisodio() {
    const episodio = document.getElementById("episodio");
    const arrayEpisode = [ "S01E01", "S01E02", "S01E03", "S01E04", "S01E05", "S01E06", "S01E07", "S01E08", "S01E09", "S01E10", "S01E11", "S02E01","S02E02","S02E03","S02E04","S02E05","S02E06","S02E07","S02E08","S02E09","S02E10","S03E01","S03E02","S03E03","S03E04","S03E05","S03E06","S03E07","S03E08","S03E09","S03E10","S04E01","S04E02","S04E03","S04E04","S04E05","S04E06","S04E07","S04E08","S04E09","S04E10","S05E01","S05E02","S05E03","S05E04","S05E05","S05E06","S05E07","S05E08","S05E09","S05E10"]
    let html = '<select name="episodio" id="episodio">';

    for (let i = 0; i < arrayEpisode.length; i++) {
        html += '<option value="' + i+1 + '">' + arrayEpisode[i] + '</option>';
    }

    html += '</select>';
    
    episodio.innerHTML += html;
}
/* FIN SCRIPT DE LAS OPCIONES DE LAS FICHAS*/