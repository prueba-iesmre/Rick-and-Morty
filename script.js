/* SCRIPT PARA CREAR FICHAS DINAMICAMENTE */
/*function ficha(){
const contenedor = document.getElementById("contenedor");

for(let i = 0; i < 12; i++){
contenedor.innerHTML += `
<div class="fichas">
    <div class="imagen">
        <img src="img/rick-sanchez-7426878_1280.jpg">
    </div>
        <div class="info_fichas">
        <p>Nombre:</p>
        <p>Genero:</p>
        <p>Especie:</p>
        <p>Estado:</p>
        <p>Origen:</p>
    </div>
</div>
`;
}
}*/
/* FIN SCRIPT PARA CREAR FICHAS DINAMICAMENTE */


/* SCRIPT PARA SELECCIONAR TIPO DE BUSQUEDA  */
function usarAPI() {
    document.getElementById("bienvenida").style.display = "none";
}

function usarBBDD() {
    document.getElementById("bienvenida").style.display = "none";
}
/* FIN SCRIPT PARA SELECCIONAR TIPO DE BUSQUEDA  */

/* Fetch para coger datos de la api */
async function cargarPersonajes() {
        const response = await fetch("https://rickandmortyapi.com/api/character");


        const data = await response.json();
        console.log(data.results);
}
/*async function ficha() {

  const contenedor = document.getElementById("contenedor");

  const response = await fetch("https://rickandmortyapi.com/api/character");
  const data = await response.json();

  contenedor.innerHTML = ""; // limpiar antes

  for (let i = 0; i < 12; i++) {

    const char = data.results[i];

    contenedor.innerHTML += `
    <div class="fichas">
        <div class="imagen">
            <img src="${char.image}">
        </div>

        <div class="info_fichas">
            <p>Nombre: ${char.name}</p>
            <p>Genero: ${char.gender}</p>
            <p>Especie: ${char.species}</p>
            <p>Estado: ${char.status}</p>
            <p>Origen: ${char.origin.name}</p>
        </div>
    </div>
    `;
  }
}

ficha();*/
/*async function ficha() {

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

ficha();*/

async function ficha() {

  const contenedor = document.getElementById("contenedor");
  contenedor.innerHTML = "";

  const response = await fetch("https://rickandmortyapi.com/api/character");
  const data = await response.json();

  for (let i = 0; i < 12; i++) {

    const char = data.results[i];

    // 🧱 Tarjeta principal
    const card = document.createElement("div");
    card.classList.add("fichas");

    // 🖼 Imagen
    const imgDiv = document.createElement("div");
    imgDiv.classList.add("imagen");

    const img = document.createElement("img");
    img.src = char.image;

    imgDiv.appendChild(img);

    // 📄 Info
    const info = document.createElement("div");
    info.classList.add("info_fichas");

    const nombre = document.createElement("p");
    nombre.textContent = "Nombre: " + char.name;

    const genero = document.createElement("p");
    genero.textContent = "Genero: " + char.gender;

    const especie = document.createElement("p");
    especie.textContent = "Especie: " + char.species;

    const estado = document.createElement("p");
    estado.textContent = "Estado: " + char.status;

    const origen = document.createElement("p");
    origen.textContent = "Origen: " + char.origin.name;

    // 🔗 Montar info
    info.appendChild(nombre);
    info.appendChild(genero);
    info.appendChild(especie);
    info.appendChild(estado);
    info.appendChild(origen);

    // 🔗 Montar tarjeta
    card.appendChild(imgDiv);
    card.appendChild(info);

    // 📦 Añadir al contenedor
    contenedor.appendChild(card);
  }
}

ficha();